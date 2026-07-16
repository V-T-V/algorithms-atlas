import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, minDepth } from './impl.ts';
export const DEFAULT_INPUT = [3, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '最小深度', en: 'Min depth' }).commit();
  const d = minDepth(root, {
    onVisit: (v) =>
      rec
        .begin({ zh: '访问 ' + v, en: 'visit ' + v })
        .setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最小深度 = ' + d, en: 'min depth = ' + d })
    .setAux([{ label: 'minDepth', value: String(d), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
