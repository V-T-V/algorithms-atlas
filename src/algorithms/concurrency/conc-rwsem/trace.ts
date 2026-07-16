import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateRwSem } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '读写信号量', en: 'RW semaphore' }).commit();
  simulateRwSem(
    [
      { thread: 0, action: 'down_write' },
      { thread: 0, action: 'downgrade' }, // 写→读
      { thread: 1, action: 'down_read' },
      { thread: 0, action: 'up_read' },
      { thread: 1, action: 'up_read' },
    ],
    {
      onWriteAcquire: (t) =>
        rec
          .begin({ zh: `T${t} 写`, en: `T${t} write` })
          .setAux([{ label: 'writer', value: 'T' + t, role: 'warn' as BarRole }])
          .commit(),
      onDowngrade: (t) =>
        rec
          .begin({ zh: `T${t} 降级为读者`, en: `T${t} downgrade to reader` })
          .setAux([{ label: 'downgrade', value: 'T' + t, role: 'final' as BarRole }])
          .commit(),
      onReadAcquire: (t, n) =>
        rec
          .begin({ zh: `T${t} 读（共${n}）`, en: `T${t} read (${n})` })
          .setAux([{ label: 'readers', value: String(n), role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
