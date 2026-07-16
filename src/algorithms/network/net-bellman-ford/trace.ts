import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bellmanFord, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: -3 },
    { from: 'C', to: 'D', weight: 4 },
  ],
  directed: true,
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Bellman-Ford 从 A', en: 'Bellman-Ford from A' }).commit();
  const { dist, negCycle } = bellmanFord(input, 'A', {
    onRound: (r, upd) =>
      rec
        .begin({ zh: '第 ' + r + ' 轮，更新？' + upd, en: 'round ' + r + ' updated=' + upd })
        .setAux([{ label: 'round', value: String(r), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '负环？' + negCycle, en: 'neg cycle? ' + negCycle })
    .setBars(
      [...dist.entries()].map(([k, v]) => ({
        value: v === Infinity ? 99 : v,
        role: 'final' as BarRole,
        label: k,
      })),
    )
    .commit();
  return rec.build();
}
