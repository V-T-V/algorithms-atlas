import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tdZero, type TdProblem } from './impl.ts';
const P: TdProblem = {
  states: [0, 1],
  policy: () => 0,
  step: (s) => (s === 0 ? { s2: 1, r: 1, done: false } : { s2: 1, r: 0, done: true }),
  episodes: 50,
  maxSteps: 3,
  alpha: 0.5,
  gamma: 0.9,
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: TdProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'TD(0)', en: 'TD(0)' }).commit();
  const V = tdZero(input, {
    onEpisode: (ep) =>
      rec
        .begin({ zh: '回合 ' + ep, en: 'ep ' + ep })
        .setAux([{ label: 'ep', value: String(ep), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: 'V=' + V.map((v) => v.toFixed(2)).join(','), en: 'V' })
    .setAux([{ label: 'V', value: V.map((v) => v.toFixed(2)).join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
