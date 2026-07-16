import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optimisticLock } from './impl.ts';
export const DEFAULT_INPUT = { readVer: 5, curVer: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '乐观锁', en: 'Optimistic Lock' }).commit();
  const r = optimisticLock(input.readVer, input.curVer, (v) => v + 1, {
    onRead: (v) =>
      rec
        .begin({ zh: '读版本 ' + v, en: 'read' })
        .setAux([{ label: 'ver', value: String(v), role: 'compare' as BarRole }])
        .commit(),
    onCommit: (ok) =>
      rec
        .begin({ zh: ok ? '提交成功' : '提交失败', en: 'commit' })
        .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
        .commit(),
    onRetry: () =>
      rec
        .begin({ zh: '重试', en: 'retry' })
        .setAux([{ label: 'retry', value: 'retry', role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 ' + r.ok + ' ver=' + r.ver, en: 'result' })
    .setAux([{ label: 'ok', value: String(r.ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
