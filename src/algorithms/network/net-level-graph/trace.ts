// 分层图 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildLevelGraph, sinkReachable, type ResidualGraph, type ResEdge } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 5,
  source: 0,
  sink: 4,
  // 残量图：0->1->3->4, 0->2->3, 1->2
  graph: new Map<number, ResEdge[]>([
    [
      0,
      [
        { to: 1, cap: 4, isForward: true },
        { to: 2, cap: 3, isForward: true },
      ],
    ],
    [
      1,
      [
        { to: 3, cap: 2, isForward: true },
        { to: 2, cap: 1, isForward: true },
      ],
    ],
    [2, [{ to: 3, cap: 5, isForward: true }]],
    [3, [{ to: 4, cap: 3, isForward: true }]],
    [4, []],
  ]) as ResidualGraph,
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const POS: Record<number, { x: number; y: number }> = {
    0: { x: 0.1, y: 0.5 },
    1: { x: 0.32, y: 0.2 },
    2: { x: 0.32, y: 0.8 },
    3: { x: 0.62, y: 0.5 },
    4: { x: 0.9, y: 0.5 },
  };

  const { levels, levelGraph } = buildLevelGraph(input.graph, input.n, input.source, input.sink, {
    onLevel: (lv) => {
      const nodes: GraphNode[] = Array.from({ length: input.n }, (_, i) => ({
        id: String(i),
        label: `${i}(L${lv[i]! < 0 ? '-' : lv[i]!})`,
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role: (i === input.source ? 'pivot' : i === input.sink ? 'final' : 'default') as BarRole,
      }));
      rec
        .begin({
          zh: `BFS 分层：levels=${JSON.stringify(lv)}`,
          en: `BFS levels=${JSON.stringify(lv)}`,
        })
        .setGraph(nodes, [])
        .setAux(
          lv.map((l, i) => ({
            label: `v${i}`,
            value: String(l < 0 ? '-' : l),
            role: 'frontier' as BarRole,
          })),
        )
        .commit();
    },
  });

  // 分层图边
  const lEdges: GraphEdge[] = [];
  for (let u = 0; u < input.n; u++) {
    for (const a of levelGraph.get(u) ?? []) {
      lEdges.push({
        from: String(u),
        to: String(a.to),
        weight: a.cap,
        directed: true,
        role: 'frontier' as BarRole,
      });
    }
  }
  const finalNodes: GraphNode[] = Array.from({ length: input.n }, (_, i) => ({
    id: String(i),
    label: `${i}(L${levels[i]! < 0 ? '-' : levels[i]!})`,
    x: POS[i]?.x ?? 0.5,
    y: POS[i]?.y ?? 0.5,
    role: (sinkReachable(levels, input.sink) && i === input.sink ? 'final' : 'default') as BarRole,
  }));
  rec
    .begin({
      zh: `分层图：汇可达=${sinkReachable(levels, input.sink)}`,
      en: `Level graph: sink reachable=${sinkReachable(levels, input.sink)}`,
    })
    .setGraph(finalNodes, lEdges)
    .commit();
  return rec.build();
}
