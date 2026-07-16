import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSeqLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '顺序锁', en: 'Sequence lock' })
    .setAux([{ label: 'seq', value: '0', role: 'compare' as BarRole }])
    .commit();
  simulateSeqLock(
    [
      { thread: 0, action: 'read' },
      { thread: 1, action: 'write-begin' },
      { thread: 0, action: 'read' }, // 应重试
      { thread: 1, action: 'write-end' },
      { thread: 0, action: 'read' },
    ],
    {
      onWriteBegin: (t, s) =>
        rec
          .begin({ zh: `T${t} 写入开始 seq=${s}`, en: `T${t} write-begin seq=${s}` })
          .setAux([{ label: 'seq', value: String(s), role: 'warn' as BarRole }])
          .commit(),
      onWriteEnd: (t, s) =>
        rec
          .begin({ zh: `T${t} 写入结束 seq=${s}`, en: `T${t} write-end seq=${s}` })
          .setAux([{ label: 'seq', value: String(s), role: 'final' as BarRole }])
          .commit(),
      onReadOk: (t, s, v) =>
        rec
          .begin({ zh: `T${t} 读 ok value=${v}`, en: `T${t} read ok value=${v}` })
          .setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
