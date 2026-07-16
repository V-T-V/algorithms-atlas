import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSlowLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Slow Path Lock', en: 'Slow Path Lock' }).commit();
  simulateSlowLock(
    [
      { thread: 0, action: 'lock' },
      { thread: 1, action: 'lock' },
      { thread: 0, action: 'unlock' },
      { thread: 1, action: 'unlock' },
    ],
    {
      onEnqueue: (t) =>
        rec
          .begin({ zh: `T${t} 入队`, en: `T${t} enqueue` })
          .setAux([{ label: 'queue', value: 'T' + t, role: 'compare' as BarRole }])
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
