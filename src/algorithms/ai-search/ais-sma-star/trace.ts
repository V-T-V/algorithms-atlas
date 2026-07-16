import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { smaStarSearch, type SmaGraph } from './impl.ts';
const G: SmaGraph = {
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
export function buildTrace(input: SmaGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SMA* memLimit=8', en: 'SMA* mem=8' }).commit();
  const path = smaStarSearch(input, 8, {
    onExpand: (n, f) =>
      rec
        .begin({ zh: '展开 ' + n + ' f=' + f, en: 'expand ' + n })
        .setAux([{ label: 'node', value: String(n), role: 'compare' as BarRole }])
        .commit(),
    onForget: (n) =>
      rec
        .begin({ zh: '丢弃 ' + n, en: 'forget ' + n })
        .setAux([{ label: 'forget', value: String(n), role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') })
    .setAux([{ label: 'path', value: path.join('->'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
