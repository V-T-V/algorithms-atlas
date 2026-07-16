import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fringeSearch, type FringeGraph } from './impl.ts';
const G: FringeGraph = {
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
export function buildTrace(input: FringeGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Fringe Search', en: 'Fringe Search' }).commit();
  const path = fringeSearch(input, {
    onThreshold: (t) =>
      rec
        .begin({ zh: '阈值 ' + t, en: 'thr ' + t })
        .setAux([{ label: 'thr', value: String(t), role: 'pivot' as BarRole }])
        .commit(),
    onExpand: (n, f) =>
      rec
        .begin({ zh: '展开 ' + n + ' f=' + f, en: 'expand ' + n })
        .setAux([{ label: 'node', value: String(n), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') })
    .setAux([{ label: 'path', value: path.join('->'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
