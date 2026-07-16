import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { articulationPoints, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '求割点', en: 'Articulation points' }).commit();
  const pts = articulationPoints(input, {
    onArticulation: (v) =>
      rec
        .begin({ zh: '割点 ' + v, en: 'articulation ' + v })
        .setAux([{ label: 'art', value: v, role: 'swap' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '割点：' + pts.join(','), en: 'points: ' + pts.join(',') })
    .setBars(pts.map((p) => ({ value: 1, role: 'final' as BarRole, label: p })))
    .commit();
  return rec.build();
}
