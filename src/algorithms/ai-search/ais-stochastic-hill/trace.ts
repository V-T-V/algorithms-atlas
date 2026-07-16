import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stochasticHill, type ShcProblem } from './impl.ts';
const P: ShcProblem = {
  start: 0,
  eval: (x) => -Math.abs(x - 7) + 10,
  neighbors: (x) => [x - 1, x + 1],
  rand: () => Math.random(),
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: ShcProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '随机爬山', en: 'Stochastic HC' }).commit();
  const best = stochasticHill(input, 12, {
    onStep: (c, v) =>
      rec
        .begin({ zh: '状态 ' + c + ' 值' + v.toFixed(1), en: 'state ' + c })
        .setAux([{ label: 'state', value: String(c), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '终态 ' + best, en: 'final ' + best })
    .setAux([{ label: 'final', value: String(best), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
