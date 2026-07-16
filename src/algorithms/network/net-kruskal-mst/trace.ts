import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kruskalMST, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 4 },
    { from: 'C', to: 'D', weight: 3 },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Kruskal MST', en: 'Kruskal MST' }).commit();
  const total = kruskalMST(input, {
    onPick: (f, t, w) =>
      rec
        .begin({ zh: '选边 ' + f + '-' + t + ' w=' + w, en: 'pick ' + f + '-' + t + ' w=' + w })
        .setBars([{ value: w, role: 'pivot' as BarRole, label: f + '-' + t }])
        .commit(),
  });
  rec
    .begin({ zh: '总权 = ' + total, en: 'total = ' + total })
    .setAux([{ label: 'total', value: String(total), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
