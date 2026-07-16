import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, levelOrder } from './impl.ts';
export const DEFAULT_INPUT = [3, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '层序遍历', en: 'Level order' }).commit();
  const levels = levelOrder(root, {
    onLevel: (d, vals) =>
      rec
        .begin({
          zh: '第 ' + d + ' 层：' + vals.join(','),
          en: 'level ' + d + ': ' + vals.join(','),
        })
        .setBars(vals.map((v) => ({ value: v, role: 'pivot' as BarRole })))
        .commit(),
  });
  const flat = levels.flat();
  rec
    .begin({ zh: '结果：' + flat.join(' → '), en: 'Result: ' + flat.join(' → ') })
    .setBars(flat.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
