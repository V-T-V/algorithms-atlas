// 负圈消除最小费用流 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minCostByCycleCancel, type McEdge } from './impl.ts';

export const DEFAULT_INPUT = {
  nodes: ['S', 'A', 'B', 'T'],
  edges: [
    { from: 'S', to: 'A', cap: 4, cost: 1 },
    { from: 'S', to: 'B', cap: 4, cost: 5 },
    { from: 'A', to: 'B', cap: 2, cost: -2 },
    { from: 'A', to: 'T', cap: 3, cost: 3 },
    { from: 'B', to: 'T', cap: 5, cost: 2 },
  ] as McEdge[],
  source: 'S',
  sink: 'T',
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = minCostByCycleCancel(input.edges, input.nodes, input.source, input.sink);
  const POS: Record<string, { x: number; y: number }> = {
    S: { x: 0.1, y: 0.5 },
    A: { x: 0.4, y: 0.25 },
    B: { x: 0.4, y: 0.75 },
    T: { x: 0.9, y: 0.5 },
  };
  const nodes: GraphNode[] = input.nodes.map((id) => ({
    id,
    label: id,
    x: POS[id]?.x ?? 0.5,
    y: POS[id]?.y ?? 0.5,
    role: (id === input.source ? 'pivot' : id === input.sink ? 'final' : 'default') as BarRole,
  }));
  const edges: GraphEdge[] = input.edges.map((e) => ({
    from: e.from,
    to: e.to,
    weight: e.cost,
    directed: true,
    role: 'frontier' as BarRole,
  }));

  rec
    .begin({
      zh: `带费用网络：先求最大流再消除负圈`,
      en: `Costed network: max flow then cancel negative cycles`,
    })
    .setGraph(nodes, edges)
    .setAux(
      input.edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `cap${e.cap}/c${e.cost}`,
        role: 'default' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({
      zh: `最大流 ${result.maxFlow}，最小费用 ${result.minCost}`,
      en: `Max flow ${result.maxFlow}, min cost ${result.minCost}`,
    })
    .setGraph(nodes, edges)
    .setAux([{ label: 'cost', value: String(result.minCost), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
