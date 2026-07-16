import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateTimePriority } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '时间优先锁：3 线程', en: 'Time-priority lock: 3 threads' }).commit();
  simulateTimePriority(
    [
      { thread: 0, action: 'lock' },
      { thread: 1, action: 'lock' },
      { thread: 2, action: 'lock' },
      { thread: 0, action: 'unlock' }, // 应授给 T1（先等）
      { thread: 1, action: 'unlock' }, // 授给 T2
    ],
    {
      onAcquire: (t, w) =>
        rec
          .begin({ zh: `T${t} 获得（等了${w}）`, en: `T${t} acquired (waited ${w})` })
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
