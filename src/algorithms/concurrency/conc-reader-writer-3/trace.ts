import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateRwLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '读写锁', en: 'Reader-Writer Lock' }).commit();
  simulateRwLock(
    [
      { thread: 0, action: 'rlock' },
      { thread: 1, action: 'rlock' },
      { thread: 2, action: 'wlock' },
      { thread: 0, action: 'runlock' },
      { thread: 1, action: 'runlock' },
    ],
    {
      onReadAcquire: (t, a) =>
        rec
          .begin({ zh: `T${t} 读锁（共${a}读者）`, en: `T${t} rlock (${a} readers)` })
          .setAux([{ label: 'readers', value: String(a), role: 'final' as BarRole }])
          .commit(),
      onWriteAcquire: (t) =>
        rec
          .begin({ zh: `T${t} 写锁`, en: `T${t} wlock` })
          .setAux([{ label: 'writer', value: 'T' + t, role: 'warn' as BarRole }])
          .commit(),
      onBlock: (t, r) =>
        rec
          .begin({ zh: `T${t} 阻塞(${r})`, en: `T${t} blocked(${r})` })
          .setAux([{ label: 'block', value: r, role: 'warn' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
