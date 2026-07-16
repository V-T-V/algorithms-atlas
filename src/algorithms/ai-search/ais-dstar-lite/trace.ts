import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dStarLite, type DStarGraph } from './impl.ts';
const E: Record<string, number> = { '0-1': 1, '1-2': 1, '0-2': 5 };
const G: DStarGraph = {
  start: 0,
  goal: 2,
  pred: (n) =>
    n === 2
      ? [
          { from: 1, cost: E['1-2']! },
          { from: 0, cost: E['0-2']! },
        ]
      : n === 1
        ? [{ from: 0, cost: E['0-1']! }]
        : [],
  succ: (n) =>
    n === 0
      ? [
          { to: 1, cost: E['0-1']! },
          { to: 2, cost: E['0-2']! },
        ]
      : n === 1
        ? [{ to: 2, cost: E['1-2']! }]
        : [],
  h: (n) => [2, 1, 0][n] ?? 0,
};
export const DEFAULT_INPUT = G;
export function buildTrace(input: DStarGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'D* Lite', en: 'D* Lite' }).commit();
  const path = dStarLite(input, {
    onExpand: (n, r) =>
      rec
        .begin({ zh: '展开 ' + n + ' rhs=' + r, en: 'expand ' + n })
        .setAux([{ label: 'node', value: String(n), role: 'compare' as BarRole }])
        .commit(),
    onPath: (p) =>
      rec
        .begin({ zh: '路径 ' + p.join('->'), en: 'path ' + p.join('->') })
        .setAux([{ label: 'path', value: p.join('->'), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
