import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateWriterPref } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '写者优先锁', en: 'Writer-preference lock' }).commit();
  simulateWriterPref(
    [
      { thread: 0, action: 'rlock' },
      { thread: 1, action: 'wlock' }, // 写等待 → 阻塞后续读
      { thread: 2, action: 'rlock' }, // 被阻塞
      { thread: 0, action: 'runlock' },
    ],
    {
      onReadAcquire: (t) =>
        rec
          .begin({ zh: `T${t} 读`, en: `T${t} read` })
          .setAux([{ label: 'reader', value: 'T' + t, role: 'final' as BarRole }])
          .commit(),
      onWriteAcquire: (t) =>
        rec
          .begin({ zh: `T${t} 写`, en: `T${t} write` })
          .setAux([{ label: 'writer', value: 'T' + t, role: 'warn' as BarRole }])
          .commit(),
      onBlockReader: (t) =>
        rec
          .begin({ zh: `T${t} 读阻塞`, en: `T${t} reader blocked` })
          .setAux([{ label: 'blocked', value: 'T' + t, role: 'warn' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
