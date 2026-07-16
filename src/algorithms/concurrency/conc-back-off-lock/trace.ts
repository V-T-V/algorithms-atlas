import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBackoff } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '退避锁：3 线程', en: 'Backoff lock: 3 threads' })
    .setBars([0, 0, 0].map((_, i) => ({ value: 0, role: 'default' as BarRole, label: 'T' + i })))
    .commit();
  simulateBackoff(
    3,
    [
      { thread: 0, action: 'lock' },
      { thread: 1, action: 'lock' },
      { thread: 2, action: 'lock' },
      { thread: 0, action: 'unlock' },
      { thread: 1, action: 'unlock' },
      { thread: 2, action: 'unlock' },
    ],
    7,
    {
      onBackoff: (t, d) =>
        rec
          .begin({ zh: `T${t} 退避 ${d.toFixed(1)}`, en: `T${t} backoff ${d.toFixed(1)}` })
          .setAux([{ label: 'T' + t, value: d.toFixed(1), role: 'warn' as BarRole }])
          .commit(),
      onAcquire: (t) =>
        rec
          .begin({ zh: `T${t} 获得锁`, en: `T${t} acquired` })
          .setAux([{ label: 'holder', value: 'T' + t, role: 'final' as BarRole }])
          .commit(),
      onRelease: (t) =>
        rec
          .begin({ zh: `T${t} 释放`, en: `T${t} released` })
          .setAux([{ label: 'released', value: 'T' + t, role: 'swap' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
