import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bfs, type GraphInput } from './impl.ts';
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
  rec.begin({ zh: 'BFS 从 A 开始', en: 'BFS from A' }).commit();
  bfs(input, 'A', {
    onVisit: (v, d) => {
      order.push(v);
      rec
        .begin({ zh: '访问 ' + v + ' (层 ' + d + ')', en: 'visit ' + v + ' (level ' + d + ')' })
        .setBars(order.map((x, i) => ({ value: i, role: 'final' as BarRole, label: x })))
        .commit();
    },
  });
  rec
    .begin({ zh: '顺序：' + order.join(' → '), en: 'Order: ' + order.join(' → ') })
    .setBars(order.map((x, i) => ({ value: i + 1, role: 'final' as BarRole, label: x })))
    .commit();
  return rec.build();
}
