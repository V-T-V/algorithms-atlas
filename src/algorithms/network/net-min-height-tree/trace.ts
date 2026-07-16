import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinHeightTrees } from './impl.ts';
export const DEFAULT_INPUT = {
  n: 6,
  edges: [
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 4],
    [5, 4],
  ] as Array<[number, number]>,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '最小高度树', en: 'Min height trees' }).commit();
  const roots = findMinHeightTrees(input.n, input.edges, {
    onPeel: (v) =>
      rec
        .begin({ zh: '剥离叶子 ' + v, en: 'peel leaf ' + v })
        .setAux([{ label: 'leaf', value: String(v), role: 'swap' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '中心：' + roots.join(','), en: 'roots: ' + roots.join(',') })
    .setBars(roots.map((r) => ({ value: r, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
