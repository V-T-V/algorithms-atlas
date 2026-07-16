// =============================================================================
// 信号量 · 录制帧序列
// 用 setAux 展示当前许可数、等待队列；用 setBars 展示许可数随事件变化的柱状。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSemaphore, type SemaphoreEvent, type SemaphoreHooks } from './impl.ts';

export const DEFAULT_INITIAL = 2;

/** 默认事件序列：演示 acquire 阻塞与 release 唤醒。 */
export function defaultEvents(): SemaphoreEvent[] {
  return [
    { type: 'acquire', threadId: 0 }, // value: 2->1
    { type: 'acquire', threadId: 1 }, // value: 1->0
    { type: 'acquire', threadId: 2 }, // 阻塞：T2 入队
    { type: 'acquire', threadId: 3 }, // 阻塞：T3 入队
    { type: 'release' }, // 唤醒 T2（许可转交）
    { type: 'release' }, // 唤醒 T3（许可转交）
    { type: 'release' }, // 队列空：value 0->1
  ];
}

interface TraceOptions {
  initial: number;
  events: SemaphoreEvent[];
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const initial = opts.initial ?? DEFAULT_INITIAL;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();

  let value = initial;
  const queue: number[] = [];
  let highlight: BarRole = 'default';

  const snapshot = (note: { zh: string; en: string }): void => {
    const aux = [
      { label: '许可数 value', value: String(value), role: 'final' as BarRole },
      {
        label: '等待队列',
        value: queue.length ? queue.map((t) => `T${t}`).join(' ← ') : '空',
        role: (queue.length ? 'warn' : 'final') as BarRole,
      },
      {
        label: '队列长度',
        value: String(queue.length),
        role: (queue.length ? 'warn' : 'default') as BarRole,
      },
      { label: '初始许可', value: String(initial), role: 'default' as BarRole },
    ];
    // bars：用许可数作为柱高，便于直观感知余量
    const bars = [{ value, role: highlight, label: `value=${value}` }];
    rec.begin(note).setAux(aux).setBars(bars).commit();
    highlight = 'default';
  };

  snapshot({
    zh: `初始化信号量：value = ${initial}，等待队列空`,
    en: `Init semaphore: value = ${initial}, empty queue`,
  });

  const hooks: SemaphoreHooks = {
    onAcquire: (v) => {
      value = v;
      highlight = 'swap';
    },
    onBlock: (tid) => {
      queue.push(tid);
      highlight = 'warn';
    },
    onWake: (tid, v) => {
      const idx = queue.indexOf(tid);
      if (idx >= 0) queue.splice(idx, 1);
      value = v; // 净不变，但同步
      highlight = 'final';
    },
    onRelease: (v) => {
      value = v;
      highlight = 'compare';
    },
  };

  for (const ev of events) {
    // 先打一个「即将处理」的提示帧
    snapshot({
      zh: `→ ${ev.type}${ev.threadId !== undefined ? `(T${ev.threadId})` : ''}`,
      en: `→ ${ev.type}${ev.threadId !== undefined ? `(T${ev.threadId})` : ''}`,
    });
    simulateSemaphore(initial, [ev], hooks);
    snapshot({
      zh: `${ev.type} 后：value=${value}，队列长度=${queue.length}`,
      en: `after ${ev.type}: value=${value}, queue=${queue.length}`,
    });
  }

  // 终态
  rec
    .begin({
      zh: `模拟结束：value=${value}，队列剩余 ${queue.length}`,
      en: `Done: value=${value}, remaining queue ${queue.length}`,
    })
    .setAux([
      { label: '许可数 value', value: String(value), role: 'final' as BarRole },
      {
        label: '等待队列',
        value: queue.length ? queue.map((t) => `T${t}`).join(' ← ') : '空',
        role: 'final' as BarRole,
      },
      { label: '初始许可', value: String(initial), role: 'default' as BarRole },
    ])
    .setBars([{ value, role: 'final' as BarRole, label: `value=${value}` }])
    .commit();

  return rec.build();
}
