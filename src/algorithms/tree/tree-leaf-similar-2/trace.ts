import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, leafSimilar } from './impl.ts';
export const DEFAULT_INPUT = {
  a: [3, 5, 1, 6, 2, 9, 8, null, null, 7, 4],
  b: [3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, 9, 8],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildTree(input.a),
    b = buildTree(input.b);
  rec.begin({ zh: '叶子序列相似', en: 'Leaf similar' }).commit();
  const r = leafSimilar(a, b, {
    onLeaf: (v) =>
      rec
        .begin({ zh: '叶子 ' + v, en: 'leaf ' + v })
        .setAux([{ label: 'leaf', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '相似？' + r, en: 'similar? ' + r })
    .setAux([{ label: 'similar', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
