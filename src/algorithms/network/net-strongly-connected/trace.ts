import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kosaraju, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'A' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'D' },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Kosaraju SCC', en: 'Kosaraju SCC' }).commit();
  const comps = kosaraju(input, {
    onComponent: (m) =>
      rec
        .begin({ zh: 'SCC：{' + m.join(',') + '}', en: 'SCC: {' + m.join(',') + '}' })
        .setBars(m.map((x) => ({ value: 1, role: 'final' as BarRole, label: x })))
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + comps.length + ' 个 SCC', en: comps.length + ' SCCs' })
    .setAux([{ label: 'count', value: String(comps.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
