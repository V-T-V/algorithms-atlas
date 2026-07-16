import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { beamStackSearch, type BsProblem } from './impl.ts';
const P: BsProblem = {
  start: 0,
  goal: 5,
  expand: (n) => [n * 2 + 1, n * 2 + 2],
  eval: (n) => Math.abs(n - 5),
  beamWidth: 2,
  maxDepth: 5,
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: BsProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Beam Stack', en: 'Beam Stack' }).commit();
  const res = beamStackSearch(input, {
    onLayer: (d, beam) =>
      rec
        .begin({ zh: '层 ' + d + ': [' + beam.join(',') + ']', en: 'layer ' + d })
        .setAux([{ label: 'beam', value: beam.join(','), role: 'compare' as BarRole }])
        .commit(),
    onPrune: (d, k, pr) =>
      rec
        .begin({ zh: '层' + d + ' 留' + k + ' 剪' + pr, en: 'prune' })
        .setAux([{ label: 'pruned', value: String(pr), role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 ' + (res ? res.join(',') : 'null'), en: 'result' })
    .setAux([{ label: 'result', value: res ? res.join(',') : 'null', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
