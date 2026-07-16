import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateFastLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Fast Lock', en: 'Fast Lock' }).commit();
  simulateFastLock(
    [
      { thread: 0, action: 'lock' },
      { thread: 1, action: 'lock' },
      { thread: 0, action: 'unlock' },
      { thread: 1, action: 'unlock' },
    ],
    {
      onFastPath: (t) =>
        rec
          .begin({ zh: `T${t} 快路径`, en: `T${t} fast path` })
          .setAux([{ label: 'path', value: 'fast', role: 'final' as BarRole }])
          .commit(),
      onSlowPath: (t) =>
        rec
          .begin({ zh: `T${t} 慢路径入队`, en: `T${t} slow path enqueue` })
          .setAux([{ label: 'path', value: 'slow', role: 'warn' as BarRole }])
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
