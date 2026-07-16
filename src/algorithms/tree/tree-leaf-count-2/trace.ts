import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, countLeaves } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '统计叶子', en: 'Count leaves' }).commit();
  const n = countLeaves(root, {
    onLeaf: (v) =>
      rec
        .begin({ zh: '叶子 ' + v, en: 'leaf ' + v })
        .setAux([{ label: 'leaf', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '叶子数 = ' + n, en: 'leaves = ' + n })
    .setAux([{ label: 'leaves', value: String(n), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
