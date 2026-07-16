// =============================================================================
// 有界缓冲 · 录制帧序列
// 用 setBars 展示缓冲区各槽（值=产品号，0=空槽）；
// setAux 展示 empty/full/mutex 三个信号量与缓冲区占用。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBoundedBuffer, type BoundedHooks, type BoundedOp } from './impl.ts';

export const DEFAULT_CAPACITY = 4;

/** 默认操作序列：演示填满、阻塞、消费、再生产。 */
export function defaultOps(): BoundedOp[] {
  return [
    { type: 'produce' },
    { type: 'produce' },
    { type: 'produce' },
    { type: 'produce' }, // 缓冲满（empty=0）
    { type: 'produce' }, // 阻塞
    { type: 'consume' }, // 取走一个
    { type: 'produce' }, // 现在可放入
    { type: 'consume' },
    { type: 'consume' },
    { type: 'consume' },
    { type: 'consume' }, // 缓冲空
    { type: 'consume' }, // 阻塞
  ];
}

interface TraceOptions {
  capacity: number;
  ops: BoundedOp[];
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const capacity = opts.capacity ?? DEFAULT_CAPACITY;
  const ops = opts.ops ?? defaultOps();
  const rec = new TraceRecorder();

  let buffer: number[] = [];
  let sem = { empty: capacity, full: 0, mutex: 1 };
  let lastBlocked = false;
  let lastOp: BoundedOp['type'] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    // bars：每个槽一个柱，值=产品号（空槽为0）
    const bars = Array.from({ length: capacity }, (_, i) => {
      const v = buffer[i] ?? 0;
      const filled = i < buffer.length;
      const role: BarRole =
        lastBlocked && i === (lastOp === 'produce' ? capacity - 1 : 0)
          ? 'warn'
          : filled
            ? 'final'
            : 'default';
      return { value: filled ? v + 1 : 0, role, label: filled ? `[${v}]` : '空' };
    });
    const aux = [
      {
        label: 'empty',
        value: String(sem.empty),
        role: (sem.empty === 0 ? 'warn' : 'final') as BarRole,
      },
      {
        label: 'full',
        value: String(sem.full),
        role: (sem.full === 0 ? 'warn' : 'final') as BarRole,
      },
      { label: 'mutex', value: String(sem.mutex), role: 'default' as BarRole },
      {
        label: '占用',
        value: `${sem.full} / ${capacity}`,
        role: (sem.full === capacity ? 'warn' : 'default') as BarRole,
      },
      {
        label: '缓冲区',
        value: buffer.length ? `[${buffer.join(',')}]` : '∅',
        role: 'frontier' as BarRole,
      },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
    lastBlocked = false;
  };

  snapshot({
    zh: `初始化：容量 ${capacity}，empty=${capacity}，full=0，mutex=1`,
    en: `Init: capacity ${capacity}, empty=${capacity}, full=0, mutex=1`,
  });

  const hooks: BoundedHooks = {
    onProducerBlock: () => {
      lastBlocked = true;
      lastOp = 'produce';
    },
    onConsumerBlock: () => {
      lastBlocked = true;
      lastOp = 'consume';
    },
  };

  for (const op of ops) {
    const steps = simulateBoundedBuffer(capacity, [op], hooks);
    const last = steps[steps.length - 1]!;
    buffer = [...last.buffer];
    sem = { ...last.sem };
    if (last.ok) {
      snapshot({
        zh: `${op.type === 'produce' ? '生产' : '消费'}成功：buffer=[${buffer.join(',')}]`,
        en: `${op.type === 'produce' ? 'Produce' : 'Consume'} ok: buffer=[${buffer.join(',')}]`,
      });
    } else {
      lastBlocked = true;
      lastOp = op.type;
      snapshot({
        zh: `${op.type === 'produce' ? '生产' : '消费'}阻塞：${op.type === 'produce' ? '缓冲区满' : '缓冲区空'}`,
        en: `${op.type === 'produce' ? 'Produce' : 'Consume'} blocked: ${op.type === 'produce' ? 'buffer full' : 'buffer empty'}`,
      });
    }
  }

  // 终态
  rec
    .begin({
      zh: `完成：buffer=[${buffer.join(',')}]，empty=${sem.empty}，full=${sem.full}`,
      en: `Done: buffer=[${buffer.join(',')}], empty=${sem.empty}, full=${sem.full}`,
    })
    .setBars(
      Array.from({ length: capacity }, (_, i) => {
        const v = buffer[i] ?? 0;
        const filled = i < buffer.length;
        return {
          value: filled ? v + 1 : 0,
          role: 'final' as BarRole,
          label: filled ? `[${v}]` : '空',
        };
      }),
    )
    .setAux([
      { label: 'empty', value: String(sem.empty), role: 'final' as BarRole },
      { label: 'full', value: String(sem.full), role: 'final' as BarRole },
      { label: 'mutex', value: String(sem.mutex), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}
