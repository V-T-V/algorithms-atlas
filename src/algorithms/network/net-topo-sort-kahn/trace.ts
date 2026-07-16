import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { topologicalSort, type GraphInput } from './impl.ts';
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
  const order: string[] = [];
  rec.begin({ zh: '拓扑排序 Kahn', en: 'Topological sort' }).commit();
  topologicalSort(input, {
    onPop: (v) => {
      order.push(v);
      rec
        .begin({ zh: '弹出 ' + v, en: 'pop ' + v })
        .setBars(order.map((x, i) => ({ value: i + 1, role: 'pivot' as BarRole, label: x })))
        .commit();
    },
  });
  rec
    .begin({ zh: '顺序：' + order.join(' → '), en: 'Order: ' + order.join(' → ') })
    .setBars(order.map((x, i) => ({ value: i + 1, role: 'final' as BarRole, label: x })))
    .commit();
  return rec.build();
}
