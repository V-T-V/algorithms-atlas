import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateClh } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CLH 锁：2 线程', en: 'CLH lock: 2 threads' }).commit();
  simulateClh(
    [
      { thread: 0, action: 'lock' },
      { thread: 1, action: 'lock' },
      { thread: 0, action: 'unlock' },
      { thread: 1, action: 'unlock' },
    ],
    {
      onEnqueue: (t, p) =>
        rec
          .begin({
            zh: `T${t} 入队，前驱=${p < 0 ? '-' : 'T' + p}`,
            en: `T${t} enqueue, pred=${p < 0 ? '-' : 'T' + p}`,
          })
          .setAux([{ label: 'pred', value: p < 0 ? '-' : 'T' + p, role: 'compare' as BarRole }])
          .commit(),
      onAcquire: (t) =>
        rec
          .begin({ zh: `T${t} 获得`, en: `T${t} acquired` })
          .setAux([{ label: 'holder', value: 'T' + t, role: 'final' as BarRole }])
          .commit(),
      onRelease: (t) =>
        rec
          .begin({ zh: `T${t} 释放`, en: `T${t} release` })
          .setAux([{ label: 'release', value: 'T' + t, role: 'swap' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
