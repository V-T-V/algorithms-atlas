import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hasCycle, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'A' },
    { from: 'C', to: 'D' },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '无向图判环', en: 'Cycle detection' }).commit();
  const has = hasCycle(input, {
    onVisit: (v) =>
      rec
        .begin({ zh: '访问 ' + v, en: 'visit ' + v })
        .setAux([{ label: 'visit', value: v, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '有环？' + has, en: 'has cycle? ' + has })
    .setAux([{ label: 'hasCycle', value: String(has), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
