import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateAnderson } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'Anderson 锁：3 线程', en: 'Anderson lock: 3 threads' })
    .setBars(
      [1, 0, 0].map((v, i) => ({
        value: v,
        role: v ? 'final' : ('default' as BarRole),
        label: 'S' + i,
      })),
    )
    .commit();
  simulateAnderson(
    3,
    [
      { thread: 0, action: 'lock' },
      { thread: 1, action: 'lock' },
      { thread: 0, action: 'unlock' },
      { thread: 1, action: 'unlock' },
    ],
    {
      onAcquire: (t) =>
        rec
          .begin({ zh: `T${t} 获得锁`, en: `T${t} acquired` })
          .setAux([{ label: 'holder', value: 'T' + t, role: 'final' as BarRole }])
          .commit(),
      onRelease: (t) =>
        rec
          .begin({ zh: `T${t} 释放，唤醒下一槽`, en: `T${t} release, wake next slot` })
          .setAux([{ label: 'release', value: 'T' + t, role: 'swap' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
