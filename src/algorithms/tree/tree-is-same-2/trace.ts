import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isSameTree } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2, 3], b: [1, 2, 3] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildTree(input.a),
    b = buildTree(input.b);
  rec.begin({ zh: '两树相同', en: 'Same tree' }).commit();
  const r = isSameTree(a, b, {
    onCompare: (va, vb) =>
      rec
        .begin({ zh: '比较 ' + va + ' 与 ' + vb, en: 'compare ' + va + ' vs ' + vb })
        .setAux([
          { label: 'a', value: String(va), role: 'pivot' as BarRole },
          { label: 'b', value: String(vb), role: 'frontier' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '相同？' + r, en: 'same? ' + r })
    .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
