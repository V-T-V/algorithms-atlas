// 含负费用边的最小费用流 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minCostNegativeEdges, type NegCostEdge } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 4,
  s: 0,
  t: 3,
  edges: [
    { from: 0, to: 1, cap: 4, cost: -1 },
    { from: 0, to: 2, cap: 4, cost: 3 },
    { from: 1, to: 2, cap: 2, cost: 1 },
    { from: 1, to: 3, cap: 3, cost: 2 },
    { from: 2, to: 3, cap: 5, cost: 1 },
  ] as NegCostEdge[],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = minCostNegativeEdges(input.n, input.edges, input.s, input.t);
  const POS: Record<number, { x: number; y: number }> = {
    0: { x: 0.1, y: 0.5 },
    1: { x: 0.4, y: 0.25 },
    2: { x: 0.4, y: 0.75 },
    3: { x: 0.9, y: 0.5 },
  };
  const nodes: GraphNode[] = Array.from({ length: input.n }, (_, i) => ({
    id: String(i),
    label: String(i),
    x: POS[i]?.x ?? 0.5,
    y: POS[i]?.y ?? 0.5,
    role: (i === input.s ? 'pivot' : i === input.t ? 'final' : 'default') as BarRole,
  }));
  const edges: GraphEdge[] = input.edges.map((e) => ({
    from: String(e.from),
    to: String(e.to),
    weight: e.cost,
    directed: true,
    role: (e.cost < 0 ? 'warn' : 'frontier') as BarRole,
  }));

  rec
    .begin({
      zh: `含负费用边：用势能消除负边`,
      en: `Negative-cost edges: potentials remove negatives`,
    })
    .setGraph(nodes, edges)
    .setAux(
      input.edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `c${e.cost}`,
        role: (e.cost < 0 ? 'warn' : 'default') as BarRole,
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
