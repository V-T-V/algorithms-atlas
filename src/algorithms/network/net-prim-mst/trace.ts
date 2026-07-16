import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { primMST, type GraphInput } from './impl.ts';
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
  rec.begin({ zh: 'Prim MST', en: 'Prim MST' }).commit();
  const total = primMST(input, {
    onAdd: (v, w) =>
      rec
        .begin({ zh: '加入 ' + v + ' 边权 ' + w, en: 'add ' + v + ' w=' + w })
        .setAux([{ label: v, value: String(w), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '总权 = ' + total, en: 'total = ' + total })
    .setAux([{ label: 'total', value: String(total), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
