// =============================================================================
// 闭锁 · 录制帧序列
// 用 setBars 展示各线程状态，setAux 展示当前计数与等待线程列表。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateLatch, type LatchEvent, type LatchHooks, type LatchThreadState } from './impl.ts';

export const DEFAULT_INITIAL_COUNT = 3;
export const DEFAULT_N_THREADS = 4;

export function defaultEvents(): LatchEvent[] {
  return [
    { thread: 0, action: 'await' }, // 阻塞
    { thread: 1, action: 'await' }, // 阻塞
    { thread: 0, action: 'countDown' }, // 3 -> 2
    { thread: 2, action: 'countDown' }, // 2 -> 1
    { thread: 3, action: 'await' }, // 阻塞
    { thread: 1, action: 'countDown' }, // 1 -> 0 → 释放全部
  ];
}

interface TraceOptions {
  initialCount: number;
  nThreads: number;
  events: LatchEvent[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const initialCount = opts.initialCount ?? DEFAULT_INITIAL_COUNT;
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();

  const stateVal = (s: LatchThreadState): number =>
    s === 'released' ? 3 : s === 'waiting' ? 2 : 1;
  const stateRole = (s: LatchThreadState): BarRole =>
    s === 'released' ? 'final' : s === 'waiting' ? 'warn' : 'default';

  let count = initialCount;
  const states: LatchThreadState[] = new Array(nThreads).fill('idle');
  let waiters: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = Array.from({ length: nThreads }, (_, i) => ({
      value: stateVal(states[i]!),
      role: stateRole(states[i]!),
      label: `T${i} ${states[i]}`,
    }));
    const aux = [
      {
        label: '剩余计数',
        value: String(count),
        role: (count === 0 ? 'final' : 'pivot') as BarRole,
      },
      {
        label: '门状态',
        value: count === 0 ? '已打开' : '关闭',
        role: (count === 0 ? 'final' : 'warn') as BarRole,
      },
      {
        label: '等待线程',
        value: waiters.length ? waiters.map((t) => `T${t}`).join(',') : '∅',
        role: 'warn' as BarRole,
      },
      ...Array.from({ length: nThreads }, (_, i) => ({
        label: `T${i}`,
        value: states[i]!,
        role: stateRole(states[i]!) as BarRole,
      })),
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({
    zh: `初始化：计数 = ${initialCount}，门关闭`,
    en: `Init: count = ${initialCount}, gate closed`,
  });

  const hooks: LatchHooks = {
    onAwait: (_t, _c, blocked) => {
      void blocked;
    },
    onCountDown: (_t, newCount) => {
      count = newCount;
    },
    onRelease: (woken) => {
      for (const t of woken) states[t] = 'released';
      waiters = [];
    },
  };

  for (const ev of events) {
    const steps = simulateLatch(initialCount, nThreads, [ev], hooks);
    const last = steps[steps.length - 1];
    if (last) {
      count = last.count;
      for (let i = 0; i < nThreads; i++) states[i] = last.states[i]!;
      waiters = last.waiters;
    }
    const actionZh =
      ev.action === 'await'
        ? `T${ev.thread} await（${count === 0 ? '立即返回' : '阻塞'}）`
        : `T${ev.thread} countDown（计数 → ${count}${count === 0 ? '，门打开' : ''}）`;
    const actionEn =
      ev.action === 'await'
        ? `T${ev.thread} await (${count === 0 ? 'returns immediately' : 'blocks'})`
        : `T${ev.thread} countDown (count → ${count}${count === 0 ? ', gate opens' : ''})`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  // 终态
  rec
    .begin({
      zh: count === 0 ? `门已打开，所有等待者释放` : `门未打开`,
      en: count === 0 ? `Gate open, all waiters released` : `Gate still closed`,
    })
    .setBars(
      Array.from({ length: nThreads }, (_, i) => ({
        value: stateVal(states[i]!),
        role: 'final' as BarRole,
        label: `T${i} ${states[i]}`,
      })),
    )
    .setAux([
      { label: '剩余计数', value: String(count), role: 'final' as BarRole },
      { label: '门状态', value: count === 0 ? '已打开' : '关闭', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
