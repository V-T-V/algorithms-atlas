import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rtaStarSearch, type RtaGraph } from './impl.ts';
const G: RtaGraph = {
  start: 0,
  goal: 3,
  neighbors: (n) => (n === 0 ? [1, 2] : n === 1 ? [3] : n === 2 ? [1, 3] : []),
  h0: (n) => [3, 2, 1, 0][n] ?? 0,
};
export const DEFAULT_INPUT = G;
export function buildTrace(input: RtaGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RTA*', en: 'RTA*' }).commit();
  const path = rtaStarSearch(input, 50, {
    onStep: (c, nx) =>
      rec
        .begin({ zh: '在' + c + ' 去' + nx, en: c + '->' + nx })
        .setAux([
          { label: 'from', value: String(c), role: 'compare' as BarRole },
          { label: 'to', value: String(nx), role: 'pivot' as BarRole },
        ])
        .commit(),
    onGoal: (n) =>
      rec
        .begin({ zh: '到达 ' + n, en: 'goal ' + n })
        .setAux([{ label: 'goal', value: String(n), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') })
    .setAux([{ label: 'path', value: path.join('->'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
