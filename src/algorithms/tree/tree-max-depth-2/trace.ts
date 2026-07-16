import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, maxDepth } from './impl.ts';
export const DEFAULT_INPUT = [3, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '求最大深度', en: 'Max depth' }).commit();
  const d = maxDepth(root, {
    onVisit: (v, dep) =>
      rec
        .begin({ zh: '节点 ' + v + ' 深度 ' + dep, en: 'node ' + v + ' depth ' + dep })
        .setAux([{ label: 'depth', value: String(dep), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最大深度 = ' + d, en: 'max depth = ' + d })
    .setAux([{ label: 'maxDepth', value: String(d), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
