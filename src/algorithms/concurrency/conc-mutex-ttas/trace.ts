// Test-Test-And-Set 锁 · 录制

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateTtas, type TtasEvent, type ThreadState } from './impl.ts';

export const DEFAULT_N_THREADS = 3;
export function defaultEvents(): TtasEvent[] {
  return [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
    { thread: 2, action: 'unlock' },
  ];
}

export function buildTrace(opts: { nThreads?: number; events?: TtasEvent[] } = {}): Frame[] {
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();
  const states: ThreadState[] = new Array(nThreads).fill('idle');
  let flag = 0;
  let holder = -1;
  let queue: number[] = [];
  let reads = new Array(nThreads).fill(0);

  const role = (s: ThreadState): BarRole =>
    s === 'critical' ? 'final' : s === 'reading' ? 'compare' : s === 'waiting' ? 'warn' : 'default';

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        Array.from({ length: nThreads }, (_, i) => ({
          value: reads[i]! + 1,
          role: role(states[i]!),
          label: `T${i}:${states[i]}`,
        })),
      )
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
        {
          label: '读自旋总数',
          value: reads.reduce((a, b) => a + b, 0).toString(),
          role: 'compare' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: `初始化 ${nThreads} 线程`, en: `Init ${nThreads} threads` });

  for (const ev of events) {
    const steps = simulateTtas(nThreads, [ev]);
    const last = steps[steps.length - 1]!;
    flag = last.flag;
    holder = last.holder;
    queue = [...last.queue];
    reads = [...last.reads];
    for (let i = 0; i < nThreads; i++) states[i] = last.states[i]!;
    snap({
      zh: `${ev.action === 'lock' ? '请求' : '释放'} T${ev.thread}`,
      en: `${ev.action} T${ev.thread}`,
    });
  }

  rec
    .begin({ zh: '完成：读自旋降低总线争用', en: 'Done: read-spin reduces bus traffic' })
    .setAux([
      {
        label: '总读自旋',
        value: reads.reduce((a, b) => a + b, 0).toString(),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
