// =============================================================================
// 面包店算法 · 录制帧序列
// 用 setBars 展示各线程的号牌（柱高=号牌值，0 表示未取号）；
// setAux 展示各线程状态与当前在临界区的线程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  bakeryLock,
  type BakeryHooks,
  type BakeryRequest,
  type BakeryThreadState,
} from './impl.ts';

export const DEFAULT_N_THREADS = 3;

/** 默认请求序列：演示取号、排队、进入、退出、唤醒。 */
export function defaultRequests(): BakeryRequest[] {
  return [
    { thread: 0, action: 'lock' }, // 取号 1，进入
    { thread: 1, action: 'lock' }, // 取号 2，等待
    { thread: 2, action: 'lock' }, // 取号 3，等待
    { thread: 0, action: 'critical' },
    { thread: 0, action: 'unlock' }, // 退出，唤醒 T1
    { thread: 1, action: 'critical' },
    { thread: 1, action: 'unlock' }, // 退出，唤醒 T2
    { thread: 2, action: 'critical' },
    { thread: 2, action: 'unlock' },
  ];
}

interface TraceOptions {
  nThreads: number;
  requests: BakeryRequest[];
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const requests = opts.requests ?? defaultRequests();
  const rec = new TraceRecorder();

  const numbers: number[] = new Array(nThreads).fill(0);
  const states: BakeryThreadState[] = new Array(nThreads).fill('idle');
  let inCritical = -1;

  const stateLabel = (s: BakeryThreadState): string =>
    s === 'idle' ? '空闲' : s === 'choosing' ? '取号' : s === 'waiting' ? '等待' : '临界区';
  const stateRole = (s: BakeryThreadState): BarRole =>
    s === 'critical' ? 'final' : s === 'waiting' ? 'warn' : s === 'choosing' ? 'swap' : 'default';

  const snapshot = (note: { zh: string; en: string }): void => {
    // bars：号牌为柱高，高亮临界区与等待者
    const bars = Array.from({ length: nThreads }, (_, i) => ({
      value: numbers[i]!,
      role: i === inCritical ? ('final' as BarRole) : stateRole(states[i]!),
      label: `T${i} #${numbers[i]}`,
    }));
    const aux = [
      ...Array.from({ length: nThreads }, (_, i) => ({
        label: `T${i} 状态`,
        value: stateLabel(states[i]!),
        role: (i === inCritical ? 'final' : stateRole(states[i]!)) as BarRole,
      })),
      {
        label: '临界区',
        value: inCritical === -1 ? '空闲' : `T${inCritical}`,
        role: (inCritical === -1 ? 'default' : 'final') as BarRole,
      },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({
    zh: `初始化：${nThreads} 个线程，号牌全为 0`,
    en: `Init: ${nThreads} threads, all tickets 0`,
  });

  const hooks: BakeryHooks = {
    onTakeNumber: (thread, ticket) => {
      numbers[thread] = ticket;
      states[thread] = 'waiting';
    },
    onWait: (thread, _blockedBy) => {
      states[thread] = 'waiting';
    },
    onEnter: (thread) => {
      states[thread] = 'critical';
      inCritical = thread;
    },
    onLeave: (thread) => {
      numbers[thread] = 0;
      states[thread] = 'idle';
      if (inCritical === thread) inCritical = -1;
    },
  };

  for (const req of requests) {
    bakeryLock(nThreads, [req], hooks);
    const actionZh =
      req.action === 'lock'
        ? `T${req.thread} 取号并尝试`
        : req.action === 'critical'
          ? `T${req.thread} 在临界区`
          : `T${req.thread} 退出临界区`;
    const actionEn =
      req.action === 'lock'
        ? `T${req.thread} takes ticket`
        : req.action === 'critical'
          ? `T${req.thread} in critical section`
          : `T${req.thread} leaves critical section`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  // 终态
  rec
    .begin({
      zh: `完成：全程同一时刻至多一个线程在临界区（互斥）`,
      en: `Done: at most one thread in critical section at any time (mutual exclusion)`,
    })
    .setBars(
      Array.from({ length: nThreads }, (_, i) => ({
        value: 0,
        role: 'final' as BarRole,
        label: `T${i} #0`,
      })),
    )
    .setAux([
      ...Array.from({ length: nThreads }, (_, i) => ({
        label: `T${i} 状态`,
        value: '完成',
        role: 'final' as BarRole,
      })),
      { label: '临界区', value: '空闲', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
