import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dijkstra, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'C', to: 'B', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'D', to: 'E', weight: 2 },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Dijkstra 从 A', en: 'Dijkstra from A' }).commit();
  const dist = dijkstra(input, 'A', {
    onRelax: (u, v, nd) =>
      rec
        .begin({ zh: '松弛 ' + u + '→' + v + ' = ' + nd, en: 'relax ' + u + '→' + v + ' = ' + nd })
        .setAux([{ label: v, value: String(nd), role: 'pivot' as BarRole }])
        .commit(),
  });
  const entries = [...dist.entries()].map(([k, v]) => ({
    label: k,
    value: v === Infinity ? 999 : v,
    role: 'final' as BarRole,
  }));
  rec.begin({ zh: '完成', en: 'Done' }).setBars(entries).commit();
  return rec.build();
}
