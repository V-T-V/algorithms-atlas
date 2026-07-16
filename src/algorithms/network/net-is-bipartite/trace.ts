import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isBipartite, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '二分图判断', en: 'Is bipartite' }).commit();
  const b = isBipartite(input, {
    onColor: (v, c) =>
      rec
        .begin({ zh: v + ' 染色 ' + c, en: v + ' color ' + c })
        .setAux([{ label: 'color', value: String(c), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '二分图？' + b, en: 'bipartite? ' + b })
    .setAux([{ label: 'bipartite', value: String(b), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
