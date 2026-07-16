import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lrtaStarSearch, type LrtaGraph } from './impl.ts';
const G: LrtaGraph = {
  start: 0,
  goal: 3,
  neighbors: (n) => (n === 0 ? [1, 2] : n === 1 ? [3] : n === 2 ? [1] : []),
  h0: (n) => [3, 2, 1, 0][n] ?? 0,
};
export const DEFAULT_INPUT = G;
export function buildTrace(input: LrtaGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LRTA*', en: 'LRTA*' }).commit();
  const path = lrtaStarSearch(input, 50, {
    onStep: (n, h) =>
      rec
        .begin({ zh: '在 ' + n + ' h=' + h, en: 'at ' + n })
        .setAux([
          { label: 'node', value: String(n), role: 'compare' as BarRole },
          { label: 'h', value: String(h), role: 'pivot' as BarRole },
        ])
        .commit(),
    onGoal: (n) =>
      rec
        .begin({ zh: '到达 ' + n, en: 'reached ' + n })
        .setAux([{ label: 'goal', value: String(n), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') })
    .setAux([{ label: 'path', value: path.join('->'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
