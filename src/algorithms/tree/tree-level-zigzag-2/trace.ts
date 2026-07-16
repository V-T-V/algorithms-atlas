import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, zigzagLevelOrder } from './impl.ts';
export const DEFAULT_INPUT = [3, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '锯齿层序', en: 'Zigzag level order' }).commit();
  const levels = zigzagLevelOrder(root, {
    onLevel: (d, vals) =>
      rec
        .begin({
          zh: '第 ' + d + ' 层：' + vals.join(','),
          en: 'level ' + d + ': ' + vals.join(','),
        })
        .setBars(vals.map((v) => ({ value: v, role: 'pivot' as BarRole })))
        .commit(),
  });
  rec
    .begin({ zh: '完成，共 ' + levels.length + ' 层', en: levels.length + ' levels' })
    .setBars(levels.flat().map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
