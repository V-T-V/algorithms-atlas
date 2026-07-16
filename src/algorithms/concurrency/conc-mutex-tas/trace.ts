// TestAndSet 互斥锁 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateTas, type TasEvent, type ThreadState } from './impl.ts';

export const DEFAULT_N_THREADS = 3;
export function defaultEvents(): TasEvent[] {
  return [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 2, action: 'lock' },
    { thread: 1, action: 'unlock' },
    { thread: 2, action: 'unlock' },
  ];
}

export function buildTrace(opts: { nThreads?: number; events?: TasEvent[] } = {}): Frame[] {
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();
  let flag = 0;
  let holder = -1;
  const states: ThreadState[] = new Array(nThreads).fill('idle');
  let queue: number[] = [];

  const stateVal = (s: ThreadState): number => (s === 'critical' ? 3 : s === 'waiting' ? 2 : 1);
  const stateRole = (s: ThreadState): BarRole =>
    s === 'critical' ? 'final' : s === 'waiting' ? 'warn' : 'default';

  const snap = (note: { zh: string; en: string }): void => {
    const bars = Array.from({ length: nThreads }, (_, i) => ({
      value: stateVal(states[i]!),
      role: stateRole(states[i]!),
      label: `T${i}:${states[i]}`,
    }));
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        {
          label: 'flag',
          value: flag === 1 ? '占用' : '空闲',
          role: (flag === 1 ? 'final' : 'default') as BarRole,
        },
        {
          label: '持有者',
          value: holder === -1 ? '无' : `T${holder}`,
          role: (holder >= 0 ? 'final' : 'default') as BarRole,
        },
        {
          label: '等待队列',
          value: queue.length ? queue.map((t) => `T${t}`).join('→') : '∅',
          role: 'warn' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: `初始化 ${nThreads} 线程，锁空闲`, en: `Init ${nThreads} threads, lock free` });

  for (const ev of events) {
    const steps = simulateTas(nThreads, [ev]);
    const last = steps[steps.length - 1]!;
    flag = last.flag;
    holder = last.holder;
    for (let i = 0; i < nThreads; i++) states[i] = last.states[i]!;
    queue = [...last.queue];
    snap({
      zh: ev.action === 'lock' ? `T${ev.thread} 请求锁` : `T${ev.thread} 释放锁`,
      en: ev.action === 'lock' ? `T${ev.thread} requests lock` : `T${ev.thread} releases lock`,
    });
  }

  rec
    .begin({ zh: '完成：互斥成立', en: 'Done: mutual exclusion holds' })
    .setBars(
      Array.from({ length: nThreads }, (_, i) => ({
        value: 1,
        role: 'final' as BarRole,
        label: `T${i}`,
      })),
    )
    .setAux([{ label: '结果', value: '至多一个线程在临界区', role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
