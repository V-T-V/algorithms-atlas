import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, rightSideView } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, null, 5, null, 4];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '右视图', en: 'Right side view' }).commit();
  const out = rightSideView(root, {
    onLevel: (d, v) =>
      rec
        .begin({ zh: '第 ' + d + ' 层最右 = ' + v, en: 'level ' + d + ' rightmost = ' + v })
        .setAux([{ label: 'right', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '右视图：' + out.join(' → '), en: 'View: ' + out.join(' → ') })
    .setBars(out.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
