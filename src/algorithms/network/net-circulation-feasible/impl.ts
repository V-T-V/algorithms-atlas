// 带需求环流可行性 · 实现

import { fordFulkerson } from '../ford-fulkerson/impl.ts';

export interface BoundEdge {
  from: string;
  to: string;
  /** 下界。 */
  lower: number;
  /** 上界（容量）。 */
  upper: number;
}

export interface FeasibilityResult {
  feasible: boolean;
  /** 超级源到超级汇的最大流。 */
  maxFlow: number;
  /** 正不平衡之和（需匹配）。 */
  required: number;
  /** 可行环流（若 feasible）。 */
  circulation: Array<{ from: string; to: string; flow: number }>;
}

const SS = '__CIRC_SS__';
const TT = '__CIRC_TT__';

/** 判定带下界环流的可行性。 */
export function circulationFeasible(
  nodes: readonly string[],
  edges: readonly BoundEdge[],
): FeasibilityResult {
  const imbalance = new Map<string, number>();
  for (const n of nodes) imbalance.set(n, 0);
  for (const e of edges) {
    if (e.lower > e.upper) {
      return { feasible: false, maxFlow: 0, required: 0, circulation: [] };
    }
    imbalance.set(e.to, (imbalance.get(e.to) ?? 0) + e.lower);
    imbalance.set(e.from, (imbalance.get(e.from) ?? 0) - e.lower);
  }

  const reducedEdges: Array<{ from: string; to: string; capacity: number }> = [];
  for (const e of edges) reducedEdges.push({ from: e.from, to: e.to, capacity: e.upper - e.lower });

  let required = 0;
  for (const n of nodes) {
    const d = imbalance.get(n) ?? 0;
    if (d > 0) {
      reducedEdges.push({ from: SS, to: n, capacity: d });
      required += d;
    } else if (d < 0) {
      reducedEdges.push({ from: n, to: TT, capacity: -d });
    }
  }

  const allNodes = [...nodes, SS, TT];
  const result = fordFulkerson({ nodes: allNodes, edges: reducedEdges, source: SS, sink: TT });
  const feasible = result.maxFlow === required;

  // 若可行，恢复实际环流 = 下界 + 残量上的约简流
  const circulation: Array<{ from: string; to: string; flow: number }> = [];
  if (feasible) {
    for (const e of edges) {
      const fe = result.flows.find((f) => f.from === e.from && f.to === e.to);
      const reducedFlow = fe ? fe.flow : 0;
      circulation.push({ from: e.from, to: e.to, flow: e.lower + reducedFlow });
    }
  }
  return { feasible, maxFlow: result.maxFlow, required, circulation };
}
