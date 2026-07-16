import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, countNodes } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '统计节点', en: 'Count nodes' }).commit();
  const n = countNodes(root, {
    onVisit: (v) =>
      rec
        .begin({ zh: '访问 ' + v, en: 'visit ' + v })
        .setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '节点数 = ' + n, en: 'count = ' + n })
    .setAux([{ label: 'count', value: String(n), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
