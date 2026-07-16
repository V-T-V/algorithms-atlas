import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floydWarshall, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'A', to: 'C', weight: 8 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Floyd-Warshall', en: 'Floyd-Warshall' }).commit();
  const dist = floydWarshall(input, {
    onK: (k) =>
      rec
        .begin({ zh: '中转点 ' + k, en: 'via ' + k })
        .setAux([{ label: 'via', value: k, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: 'A→D = ' + dist[0]![3], en: 'A→D = ' + dist[0]![3] })
    .setAux([{ label: 'A→D', value: String(dist[0]![3]), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
