import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rbfsSearch, type RbfsGraph } from './impl.ts';
const G: RbfsGraph = {
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
export function buildTrace(input: RbfsGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RBFS', en: 'RBFS' }).commit();
  const path = rbfsSearch(input, {
    onVisit: (n, f, fl) =>
      rec
        .begin({ zh: '访问 ' + n + ' f=' + f, en: 'visit ' + n })
        .setAux([
          { label: 'node', value: String(n), role: 'compare' as BarRole },
          { label: 'f', value: String(f), role: 'pivot' as BarRole },
          { label: 'flimit', value: String(fl), role: 'default' as BarRole },
        ])
        .commit(),
    onFound: (n) =>
      rec
        .begin({ zh: '目标 ' + n, en: 'goal ' + n })
        .setAux([{ label: 'goal', value: String(n), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') })
    .setAux([{ label: 'path', value: path.join('->'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
