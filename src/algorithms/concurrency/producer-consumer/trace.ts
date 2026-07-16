// =============================================================================
// 生产者-消费者 · 录制帧序列
// 用 setArray 展示缓冲区槽位（空/占用 + 当前操作槽），
// setAux 展示信号量 empty/full 值与阻塞等待的生产者/消费者队列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { producerConsumer, type PcEvent, type ProducerConsumerHooks } from './impl.ts';

export const DEFAULT_CAPACITY = 3;
export const DEFAULT_N = 5; // 5 生产 + 5 消费，穿插若干「先满后空」场景

/** 录制演示帧序列。 */
export function buildTrace(
  capacity: number = DEFAULT_CAPACITY,
  events: PcEvent[] = defaultEvents(),
): Frame[] {
  const rec = new TraceRecorder();
  const buffer: Array<number | null> = new Array(capacity).fill(null);
  let head = 0; // 消费出队位置
  let tail = 0; // 生产入队位置
  let count = 0; // 当前元素数
  let empty = capacity;
  let full = 0;
  let activeSlot = -1;
  let lastOp: {
    kind: 'produce' | 'consume' | 'block-p' | 'block-c';
    actor: number;
    item?: number;
  } | null = null;
  const blockedProducers: number[] = [];
  const blockedConsumers: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const values = buffer.map((b) => (b === null ? -1 : b));
    const roles: BarRole[] = buffer.map((b, i) => {
      if (b === null) return 'default';
      if (i === activeSlot) return lastOp?.kind === 'consume' ? 'swap' : 'final';
      return 'sorted';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (count > 0) pointers.push({ index: head, label: 'head' });
    if (count < capacity) pointers.push({ index: tail, label: 'tail' });

    const aux = [
      { label: 'empty（空槽数）', value: String(empty), role: 'pivot' as BarRole },
      { label: 'full（已用槽数）', value: String(full), role: 'pivot' as BarRole },
      {
        label: '等待的生产者',
        value: blockedProducers.length ? blockedProducers.map((p) => `P${p}`).join(', ') : '无',
        role: (blockedProducers.length ? 'warn' : 'default') as BarRole,
      },
      {
        label: '等待的消费者',
        value: blockedConsumers.length ? blockedConsumers.map((c) => `C${c}`).join(', ') : '无',
        role: (blockedConsumers.length ? 'warn' : 'default') as BarRole,
      },
    ];
    rec.begin(note).setArray(values, roles, pointers).setAux(aux).commit();
    activeSlot = -1;
    lastOp = null;
  };

  snapshot({
    zh: `缓冲区容量 ${capacity}。信号量：empty=${empty}, full=${full}`,
    en: `Buffer capacity ${capacity}. Semaphores: empty=${empty}, full=${full}`,
  });

  const hooks: ProducerConsumerHooks = {
    onProduceTry: (actor, item) => {
      lastOp = { kind: 'produce', actor, item };
      snapshot({
        zh: `生产者 P${actor} 尝试放入产品 ${item}`,
        en: `Producer P${actor} tries to put item ${item}`,
      });
    },
    onProducerBlock: (actor) => {
      blockedProducers.push(actor);
      lastOp = { kind: 'block-p', actor };
      snapshot({
        zh: `缓冲区满，P${actor} 阻塞等待（empty=0）`,
        en: `Buffer full, P${actor} blocks (empty=0)`,
      });
    },
    onProduce: (actor, item, slot) => {
      buffer[slot] = item;
      tail = (tail + 1) % capacity;
      count++;
      empty--;
      full++;
      activeSlot = slot;
      lastOp = { kind: 'produce', actor, item };
      // 唤醒一个消费者
      if (blockedConsumers.length > 0) blockedConsumers.shift();
      snapshot({
        zh: `P${actor} 放入 ${item} → 槽 ${slot}（empty=${empty}, full=${full}）`,
        en: `P${actor} put ${item} → slot ${slot} (empty=${empty}, full=${full})`,
      });
    },
    onConsumeTry: (actor) => {
      lastOp = { kind: 'consume', actor };
      snapshot({ zh: `消费者 C${actor} 尝试取走`, en: `Consumer C${actor} tries to take` });
    },
    onConsumerBlock: (actor) => {
      blockedConsumers.push(actor);
      lastOp = { kind: 'block-c', actor };
      snapshot({
        zh: `缓冲区空，C${actor} 阻塞等待（full=0）`,
        en: `Buffer empty, C${actor} blocks (full=0)`,
      });
    },
    onConsume: (actor, item) => {
      buffer[head] = null;
      activeSlot = head;
      head = (head + 1) % capacity;
      count--;
      empty++;
      full--;
      lastOp = { kind: 'consume', actor, item };
      if (blockedProducers.length > 0) blockedProducers.shift();
      snapshot({
        zh: `C${actor} 取走 ${item}（empty=${empty}, full=${full}）`,
        en: `C${actor} took ${item} (empty=${empty}, full=${full})`,
      });
    },
  };

  producerConsumer(capacity, events, hooks);

  // 终态
  rec
    .begin({ zh: '模拟结束：缓冲区归空', en: 'Simulation done: buffer empty' })
    .setArray(new Array(capacity).fill(-1), new Array(capacity).fill('final'), [])
    .setAux([
      { label: 'empty', value: String(capacity), role: 'final' as BarRole },
      { label: 'full', value: '0', role: 'final' as BarRole },
      { label: '等待生产者', value: '无', role: 'final' as BarRole },
      { label: '等待消费者', value: '无', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}

/** 演示事件序列：先填满触发阻塞，再消费腾空。 */
function defaultEvents(): PcEvent[] {
  // 容量 3：先 4 个生产（第 4 个阻塞）→ 1 个消费（唤醒）→ 再交替消费
  // 调整为先连产 4 个（第 4 个应阻塞），再消费，再交替
  return [
    { type: 'produce', actor: 0 },
    { type: 'produce', actor: 1 },
    { type: 'produce', actor: 2 },
    { type: 'produce', actor: 3 }, // 阻塞
    { type: 'consume', actor: 0 },
    { type: 'produce', actor: 4 },
    { type: 'consume', actor: 1 },
    { type: 'consume', actor: 2 },
    { type: 'consume', actor: 3 },
    { type: 'consume', actor: 4 },
  ];
}
