// 带下界最大流 · 实现

import { circulationFeasible, type BoundEdge } from '../net-circulation-feasible/impl.ts';
import { fordFulkerson } from '../ford-fulkerson/impl.ts';

export interface LowerBoundFlowInput {
  nodes: readonly string[];
  edges: readonly BoundEdge[];
  source: string;
  sink: string;
}

export interface LowerBoundFlowResult {
  feasible: boolean;
  maxFlow: number;
  flows: Array<{ from: string; to: string; flow: number; lower: number; upper: number }>;
}

/** 带下界最大流：先判环流可行性（加 t→s ∞ 边），再在残量图增广。 */
export function maxFlowWithDemands(input: LowerBoundFlowInput): LowerBoundFlowResult {
  const { nodes, edges, source, sink } = input;
  // 下界合法性
  for (const e of edges) {
    if (e.lower > e.upper) return { feasible: false, maxFlow: 0, flows: [] };
  }
  // 加 sink->source 容量无穷（一个大数）转为环流
  const INF = edges.reduce((s, e) => s + e.upper, 0) + 1;
  const circEdges: BoundEdge[] = [...edges, { from: sink, to: source, lower: 0, upper: INF }];
  const circ = circulationFeasible(nodes, circEdges);
  if (!circ.feasible) {
    return { feasible: false, maxFlow: 0, flows: [] };
  }

  // 得到满足下界的初始环流实际流量
  const baseFlow = new Map<string, number>();
  for (const c of circ.circulation) baseFlow.set(`${c.from}>${c.to}`, c.flow);

  // 初始 s-t 流值 = 流出 source 的原图边流量之和
  let initialFlow = 0;
  for (const e of edges) {
    if (e.from === source) initialFlow += baseFlow.get(`${e.from}>${e.to}`) ?? 0;
  }

  // 在原图残量图上从 source 到 sink 继续增广（不含 t->s 边）
  const residualEdges: Array<{ from: string; to: string; capacity: number }> = [];
  for (const e of edges) {
    const f = baseFlow.get(`${e.from}>${e.to}`) ?? 0;
    if (e.upper - f > 0) residualEdges.push({ from: e.from, to: e.to, capacity: e.upper - f });
    if (f > 0) residualEdges.push({ from: e.to, to: e.from, capacity: f });
  }
  const aug = fordFulkerson({ nodes: [...nodes], edges: residualEdges, source, sink });

  const flows = edges.map((e) => {
    const f0 = baseFlow.get(`${e.from}>${e.to}`) ?? 0;
    return { from: e.from, to: e.to, flow: f0, lower: e.lower, upper: e.upper };
  });
  return { feasible: true, maxFlow: initialFlow + aug.maxFlow, flows };
}
