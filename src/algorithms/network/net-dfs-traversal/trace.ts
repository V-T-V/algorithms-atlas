import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dfs, type GraphInput } from './impl.ts';
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
  rec.begin({ zh: 'DFS 从 A 开始', en: 'DFS from A' }).commit();
  const order = dfs(input, 'A', {
    onVisit: (v) =>
      rec
        .begin({ zh: '访问 ' + v, en: 'visit ' + v })
        .setBars(
          order.length === 0 ? [] : order.map((x) => ({ value: 0, role: 'default' as BarRole })),
        )
        .setAux([{ label: 'visited', value: v, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '顺序：' + order.join(' → '), en: 'Order: ' + order.join(' → ') })
    .setBars(order.map((x, i) => ({ value: i + 1, role: 'final' as BarRole, label: x })))
    .commit();
  return rec.build();
}
