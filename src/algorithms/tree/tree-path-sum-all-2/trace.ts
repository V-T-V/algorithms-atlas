import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, pathSumAll } from './impl.ts';
export const DEFAULT_INPUT = {
  arr: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1],
  target: 22,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.arr);
  rec.begin({ zh: '路径和 = ' + input.target, en: 'Path sum = ' + input.target }).commit();
  const paths = pathSumAll(root, input.target, {
    onPath: (p) =>
      rec
        .begin({ zh: p.join('→') + ' = ' + input.target, en: p.join('→') })
        .setBars(p.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + paths.length + ' 条', en: paths.length + ' paths' })
    .setAux([{ label: 'count', value: String(paths.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
