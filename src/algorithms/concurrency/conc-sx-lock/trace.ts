import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sxLock } from './impl.ts';
export const DEFAULT_INPUT: any = [{ op: 'r' }, { op: 'r' }, { op: 'w' }, { op: 'r' }];
export function buildTrace(ops = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SX 锁', en: 'SX Lock' }).commit();
  sxLock(ops, {
    onReadAcq: (n) =>
      rec
        .begin({ zh: '读加锁 n=' + n, en: 'read' })
        .setAux([{ label: 'readers', value: String(n), role: 'compare' as BarRole }])
        .commit(),
    onWriteAcq: () =>
      rec
        .begin({ zh: '写加锁', en: 'write' })
        .setAux([{ label: 'writer', value: 'true', role: 'final' as BarRole }])
        .commit(),
    onRelease: () =>
      rec
        .begin({ zh: '释放', en: 'release' })
        .setAux([{ label: 'release', value: 'rel', role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
