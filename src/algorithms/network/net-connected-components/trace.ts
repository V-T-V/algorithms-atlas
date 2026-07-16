import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { connectedComponents, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'D', to: 'E' },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '求连通分量', en: 'Connected components' }).commit();
  const comps = connectedComponents(input, {
    onComponent: (m) =>
      rec
        .begin({ zh: '分量：{' + m.join(',') + '}', en: 'comp: {' + m.join(',') + '}' })
        .setBars(m.map((x, i) => ({ value: 1, role: 'final' as BarRole, label: x })))
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + comps.length + ' 个分量', en: comps.length + ' components' })
    .setAux([{ label: 'count', value: String(comps.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
