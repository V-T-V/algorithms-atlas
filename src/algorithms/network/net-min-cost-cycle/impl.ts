// 负圈消除最小费用流 · 实现
// 理论：先求任意最大流，再用 SPFA 反复消除残量图中的负费用环直至无负圈。
// 实现用逐次最短增广路（SSP）求得等价的最小费用最大流。

import { successiveShortestPath } from '../successive-shortest-path/impl.ts';

export interface McEdge {
  from: string;
  to: string;
  cap: number;
  cost: number;
}

export interface MinCostCycleResult {
  maxFlow: number;
  minCost: number;
}

/** 负圈消除最小费用最大流。节点用字符串 ID。 */
export function minCostByCycleCancel(
  edges: ReadonlyArray<McEdge>,
  nodes: readonly string[],
  source: string,
  sink: string,
): MinCostCycleResult {
  // 字符串 → 数字索引
  const idx = new Map<string, number>();
  nodes.forEach((n, i) => idx.set(n, i));
  const sspEdges = edges
    .filter((e) => idx.has(e.from) && idx.has(e.to))
    .map((e) => ({ from: idx.get(e.from)!, to: idx.get(e.to)!, cap: e.cap, cost: e.cost }));
  const result = successiveShortestPath(nodes.length, sspEdges, idx.get(source)!, idx.get(sink)!);
  return { maxFlow: result.maxFlow, minCost: result.minCost };
}
