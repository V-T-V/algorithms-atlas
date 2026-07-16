import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSlowPath, type SpEvent } from './impl.ts';

export const DEFAULT_N_THREADS = 3;
export function defaultEvents(): SpEvent[] {
  return [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
    { thread: 2, action: 'unlock' },
  ];
}

export function buildTrace(opts: { nThreads?: number; events?: SpEvent[] } = {}): Frame[] {
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();
  let state = 0;
  let queue: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
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

  snap({ zh: '初始化 FIFO 慢路径锁', en: 'Init FIFO slow-path lock' });

  for (const ev of events) {
    const steps = simulateSlowPath(nThreads, [ev]);
    const last = steps[steps.length - 1]!;
    state = last.state;
    queue = [...last.queue];
    snap({ zh: `T${ev.thread} ${ev.action}`, en: `T${ev.thread} ${ev.action}` });
  }

  rec
    .begin({ zh: '完成：严格 FIFO 公平', en: 'Done: strict FIFO fairness' })
    .setAux([{ label: '结果', value: '无饥饿', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
