import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isSymmetric } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 2, 3, 4, 4, 3];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '对称判断', en: 'Symmetric check' }).commit();
  const r = isSymmetric(root, {
    onCompare: (a, b) =>
      rec
        .begin({ zh: '比较 ' + a + ' 与 ' + b, en: 'compare ' + a + ' vs ' + b })
        .setAux([
          { label: 'a', value: String(a), role: 'pivot' as BarRole },
          { label: 'b', value: String(b), role: 'frontier' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '对称？' + r, en: 'symmetric? ' + r })
    .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
