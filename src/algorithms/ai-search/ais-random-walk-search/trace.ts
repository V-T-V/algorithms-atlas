import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomWalkSearch, type RwGraph } from './impl.ts';
const G: RwGraph = {
  start: 0,
  goal: 3,
  neighbors: (n) => (n === 0 ? [1, 2] : n === 1 ? [0, 3] : n === 2 ? [0, 3] : [1, 2]),
  rand: () => Math.random(),
};
export const DEFAULT_INPUT = G;
export function buildTrace(input: RwGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '随机游走', en: 'Random Walk' }).commit();
  const path = randomWalkSearch(input, 20, {
    onStep: (c, n) =>
      rec
        .begin({ zh: c + '->' + n, en: c + '->' + n })
        .setAux([{ label: 'step', value: c + '->' + n, role: 'compare' as BarRole }])
        .commit(),
    onGoal: (n) =>
      rec
        .begin({ zh: '到达 ' + n, en: 'goal ' + n })
        .setAux([{ label: 'goal', value: String(n), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径长度 ' + path.length, en: 'len ' + path.length })
    .setAux([{ label: 'len', value: String(path.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
