import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { anytimeAStar, type AraGraph } from './impl.ts';
const G: AraGraph = {
  start: 0,
  goal: 3,
  neighbors: (n) =>
    n === 0
      ? [
          { to: 1, cost: 1 },
          { to: 2, cost: 4 },
        ]
      : n === 1
        ? [{ to: 3, cost: 2 }]
        : [],
  h: (n) => [3, 2, 1, 0][n] ?? 0,
};
export const DEFAULT_INPUT = G;
export function buildTrace(input: AraGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Anytime A*', en: 'Anytime A*' }).commit();
  const best = anytimeAStar(input, 3, 1, 1, {
    onEps: (eps) =>
      rec
        .begin({ zh: 'ε=' + eps.toFixed(2), en: 'eps=' + eps.toFixed(2) })
        .setAux([{ label: 'eps', value: eps.toFixed(2), role: 'pivot' as BarRole }])
        .commit(),
    onImprove: (c, p) =>
      rec
        .begin({ zh: '改进 cost=' + c, en: 'improve ' + c })
        .setAux([
          { label: 'cost', value: String(c), role: 'final' as BarRole },
          { label: 'path', value: p.join('->'), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '最优 ' + best.join('->'), en: 'best ' + best.join('->') })
    .setAux([{ label: 'best', value: best.join('->'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
