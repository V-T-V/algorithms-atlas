import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, leftSideView } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, null, null, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '左视图', en: 'Left side view' }).commit();
  const out = leftSideView(root, {
    onLevel: (d, v) =>
      rec
        .begin({ zh: '第 ' + d + ' 层最左 = ' + v, en: 'level ' + d + ' leftmost = ' + v })
        .setAux([{ label: 'left', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '左视图：' + out.join(' → '), en: 'View: ' + out.join(' → ') })
    .setBars(out.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
