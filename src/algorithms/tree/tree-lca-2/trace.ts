import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, lowestCommonAncestor } from './impl.ts';
export const DEFAULT_INPUT = { arr: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 1 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.arr);
  rec
    .begin({
      zh: 'LCA(' + input.p + ',' + input.q + ')',
      en: 'LCA(' + input.p + ',' + input.q + ')',
    })
    .commit();
  const node = lowestCommonAncestor(root, input.p, input.q, {
    onVisit: (v) =>
      rec
        .begin({ zh: '访问 ' + v, en: 'visit ' + v })
        .setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: 'LCA = ' + (node?.value ?? null), en: 'LCA = ' + (node?.value ?? null) })
    .setAux([{ label: 'lca', value: String(node?.value ?? null), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
