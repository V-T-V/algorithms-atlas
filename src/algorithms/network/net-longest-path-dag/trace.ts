import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestPathDAG, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 3 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 2 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'E', weight: 1 },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'DAG 最长路径', en: 'Longest path DAG' }).commit();
  const m = longestPathDAG(input, {
    onRelax: (u, v, d) =>
      rec
        .begin({ zh: u + '→' + v + ' = ' + d, en: u + '→' + v + ' = ' + d })
        .setAux([{ label: 'dist', value: String(d), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最长 = ' + m, en: 'longest = ' + m })
    .setAux([{ label: 'longest', value: String(m), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
