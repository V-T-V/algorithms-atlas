import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isSubtree } from './impl.ts';
export const DEFAULT_INPUT = { root: [3, 4, 5, 1, 2], sub: [4, 1, 2] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.root),
    sub = buildTree(input.sub);
  rec.begin({ zh: '子树判断', en: 'Is subtree' }).commit();
  const r = isSubtree(root, sub, {
    onTry: (v) =>
      rec
        .begin({ zh: '在 ' + v + ' 处匹配', en: 'match at ' + v })
        .setAux([{ label: 'match', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '是子树？' + r, en: 'subtree? ' + r })
    .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
