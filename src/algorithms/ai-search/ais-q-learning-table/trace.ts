import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { qLearningTable, type QlProblem } from './impl.ts';
const P: QlProblem = {
  states: [0, 1],
  actions: [0, 1],
  episodes: 30,
  maxSteps: 5,
  alpha: 0.5,
  gamma: 0.9,
  epsilon: 0.3,
  rand: () => Math.random(),
  step: (s, a) =>
    s === 0 ? { s2: a, r: a === 1 ? 1 : 0, done: a === 1 } : { s2: 1, r: 0, done: true },
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: QlProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Q-Learning', en: 'Q-Learning' }).commit();
  const Q = qLearningTable(input, {
    onEpisode: (ep, R) =>
      rec
        .begin({ zh: '回合 ' + ep + ' R=' + R.toFixed(1), en: 'ep' })
        .setAux([
          { label: 'ep', value: String(ep), role: 'pivot' as BarRole },
          { label: 'R', value: R.toFixed(1), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: 'Q[0]=' + Q[0]!.map((v) => v.toFixed(2)).join(','), en: 'Q0' })
    .setAux([
      { label: 'Q0', value: Q[0]!.map((v) => v.toFixed(2)).join(','), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
