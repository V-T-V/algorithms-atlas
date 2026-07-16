import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateFastPath, type FpEvent } from './impl.ts';

export const DEFAULT_N_THREADS = 3;
export function defaultEvents(): FpEvent[] {
  return [
    { thread: 0, action: 'lock' },
    { thread: 0, action: 'unlock' }, // fast fast
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 1, action: 'unlock' },
    { thread: 2, action: 'unlock' },
  ];
}

export function buildTrace(opts: { nThreads?: number; events?: FpEvent[] } = {}): Frame[] {
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();
  let fastCount = 0;
  let slowCount = 0;
  let state = 0;
  let queue: number[] = [];

  const snap = (note: { zh: string; en: string }, path: 'fast' | 'slow'): void => {
    if (path === 'fast') fastCount++;
    else slowCount++;
    const holder = state > 0 ? state - 1 : -1;
    rec
      .begin(note)
      .setBars(
        Array.from({ length: nThreads }, (_, i) => ({
          value: i === holder ? 3 : queue.includes(i) ? 2 : 1,
          role: (i === holder ? 'final' : queue.includes(i) ? 'warn' : 'default') as BarRole,
          label: `T${i}`,
        })),
      )
      .setAux([
        {
          label: '本次路径',
          value: path === 'fast' ? '快速' : '慢速',
          role: (path === 'fast' ? 'final' : 'warn') as BarRole,
        },
        {
          label: '持有者',
          value: holder === -1 ? '无' : `T${holder}`,
          role: (holder >= 0 ? 'final' : 'default') as BarRole,
        },
        { label: '快速/慢速计数', value: `${fastCount}/${slowCount}`, role: 'compare' as BarRole },
      ])
      .commit();
  };

  snap({ zh: '初始化', en: 'Init' }, 'fast');

  for (const ev of events) {
    const steps = simulateFastPath(nThreads, [ev]);
    const last = steps[steps.length - 1]!;
    state = last.state;
    queue = [...last.queue];
    snap(
      {
        zh: `T${ev.thread} ${ev.action} → ${last.path}`,
        en: `T${ev.thread} ${ev.action} → ${last.path}`,
      },
      last.path,
    );
  }

  rec
    .begin({
      zh: `完成：fast=${fastCount} slow=${slowCount}`,
      en: `Done: fast=${fastCount} slow=${slowCount}`,
    })
    .setAux([
      {
        label: '统计',
        value: `快速路径 ${fastCount} 次，慢速 ${slowCount} 次`,
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
