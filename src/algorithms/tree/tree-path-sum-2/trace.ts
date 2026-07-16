import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, hasPathSum } from './impl.ts';
export const DEFAULT_INPUT = {
  arr: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1],
  target: 22,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.arr);
  rec.begin({ zh: '路径和 = ' + input.target, en: 'Path sum = ' + input.target }).commit();
  const r = hasPathSum(root, input.target, {
    onVisit: (v, rem) =>
      rec
        .begin({ zh: '节点 ' + v + ' 剩余 ' + rem, en: 'node ' + v + ' remain ' + rem })
        .setAux([{ label: 'remain', value: String(rem), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '存在？' + r, en: 'has? ' + r })
    .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
