import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isCompleteTree } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '完全二叉树判断', en: 'Is complete tree' }).commit();
  const r = isCompleteTree(root, {
    onVisit: (v) =>
      rec
        .begin({ zh: '访问 ' + (v ?? 'null'), en: 'visit ' + (v ?? 'null') })
        .setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完全？' + r, en: 'complete? ' + r })
    .setAux([{ label: 'complete', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
