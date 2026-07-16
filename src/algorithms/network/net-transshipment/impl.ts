// 转运问题 · 实现

import { successiveShortestPath } from '../successive-shortest-path/impl.ts';

export interface TransshipmentEdge {
  from: number;
  to: number;
  cap: number;
  cost: number;
}

export interface TransshipmentInput {
  /** 节点数（编号 0..n-1）。 */
  n: number;
  edges: ReadonlyArray<TransshipmentEdge>;
  /** 节点净需求：>0 表示供应（产出），<0 表示需求（吸入），0 为转运点。 */
  balance: ReadonlyArray<number>;
}

export interface TransshipmentResult {
  totalCost: number;
  totalFlow: number;
}

/** 转运问题：用超级源/汇处理不平衡后求最小费用流。 */
export function transshipment(input: TransshipmentInput): TransshipmentResult {
  const { n, edges, balance } = input;
  // 加超级源 SS 与超级汇 TT 处理节点净需求
  const SS = n;
  const TT = n + 1;
  const nodeCount = n + 2;
  const allEdges: Array<{ from: number; to: number; cap: number; cost: number }> = [...edges];
  for (let v = 0; v < n; v++) {
    const b = balance[v]!;
    if (b > 0) allEdges.push({ from: SS, to: v, cap: b, cost: 0 });
    else if (b < 0) allEdges.push({ from: v, to: TT, cap: -b, cost: 0 });
  }
  // 若平衡则 SS/TT 间无需额外边；SSP 从 SS 到 TT
  const result = successiveShortestPath(nodeCount, allEdges, SS, TT);
  return { totalCost: result.minCost, totalFlow: result.maxFlow };
}
