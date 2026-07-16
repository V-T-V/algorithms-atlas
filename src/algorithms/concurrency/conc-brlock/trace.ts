import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBrLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BRLOCK（2 CPU）', en: 'BRLOCK (2 CPUs)' }).commit();
  simulateBrLock(
    2,
    [
      { thread: 0, cpu: 0, action: 'rlock' },
      { thread: 1, cpu: 1, action: 'rlock' },
      { thread: 2, cpu: 0, action: 'wlock' }, // 等待读者退出
      { thread: 0, cpu: 0, action: 'runlock' },
      { thread: 1, cpu: 1, action: 'runlock' },
    ],
    {
      onReadAcquire: (t, c) =>
        rec
          .begin({ zh: `T${t}@CPU${c} 读`, en: `T${t}@CPU${c} read` })
          .setAux([{ label: 'cpu', value: String(c), role: 'final' as BarRole }])
          .commit(),
      onWriteAcquire: (t) =>
        rec
          .begin({ zh: `T${t} 写`, en: `T${t} write` })
          .setAux([{ label: 'writer', value: 'T' + t, role: 'warn' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
