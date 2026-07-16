import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { writerPrefRwLock } from './impl.ts';
export const DEFAULT_INPUT: any = [{ op: 'r' }, { op: 'w' }, { op: 'r' }, { op: 'w' }];
export function buildTrace(ops = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '写优先 RW 锁', en: 'Writer-Pref RW' }).commit();
  writerPrefRwLock(ops, {
    onRead: (n) =>
      rec
        .begin({ zh: '读 n=' + n, en: 'read' })
        .setAux([{ label: 'readers', value: String(n), role: 'compare' as BarRole }])
        .commit(),
    onWrite: () =>
      rec
        .begin({ zh: '写', en: 'write' })
        .setAux([{ label: 'writer', value: 'true', role: 'final' as BarRole }])
        .commit(),
    onBlockRead: () =>
      rec
        .begin({ zh: '阻塞新读', en: 'block' })
        .setAux([{ label: 'block', value: 'read', role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
