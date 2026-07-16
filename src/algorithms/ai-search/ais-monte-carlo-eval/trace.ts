import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { monteCarloEval, type McProblem } from './impl.ts';
const P: McProblem = {
  states: [0, 1],
  policy: () => 0,
  step: (s) => (s === 0 ? { s2: 1, r: 1, done: false } : { s2: 1, r: 0, done: true }),
  episodes: 40,
  maxSteps: 3,
  gamma: 1,
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: McProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MC 评估', en: 'MC eval' }).commit();
  const V = monteCarloEval(input, {
    onEpisode: (ep, G) =>
      rec
        .begin({ zh: '回合 ' + ep + ' G=' + G.toFixed(1), en: 'ep' })
        .setAux([
          { label: 'ep', value: String(ep), role: 'pivot' as BarRole },
          { label: 'G', value: G.toFixed(1), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: 'V=' + V.map((v) => v.toFixed(2)).join(','), en: 'V' })
    .setAux([{ label: 'V', value: V.map((v) => v.toFixed(2)).join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
