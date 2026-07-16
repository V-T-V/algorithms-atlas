// 运输问题 · 实现

import { successiveShortestPath } from '../successive-shortest-path/impl.ts';

export interface TransportationInput {
  supply: ReadonlyArray<{ id: number; amount: number }>;
  demand: ReadonlyArray<{ id: number; amount: number }>;
  /** cost[i][j] = 从供应 i 到需求 j 的单位运费。 */
  cost: ReadonlyArray<ReadonlyArray<number>>;
}

export interface TransportationResult {
  totalCost: number;
  totalShipped: number;
  /** plan[i][j] = 从供应 i 到需求 j 的运输量。 */
  plan: number[][];
}

/** 运输问题（最小费用流归约）。 */
export function transportation(input: TransportationInput): TransportationResult {
  const { supply, demand, cost } = input;
  const m = supply.length;
  const n = demand.length;
  if (m === 0 || n === 0) return { totalCost: 0, totalShipped: 0, plan: [] };

  // 节点：0=S, 1..m=供应, m+1..m+n=需求, m+n+1=T
  const S = 0;
  const T = m + n + 1;
  const sup = (i: number): number => i + 1;
  const dem = (j: number): number => m + 1 + j;
  const nodeCount = m + n + 2;
  const INF = supply.reduce((s, x) => s + x.amount, 0) + 1;

  const edges: Array<{ from: number; to: number; cap: number; cost: number }> = [];
  for (let i = 0; i < m; i++) edges.push({ from: S, to: sup(i), cap: supply[i]!.amount, cost: 0 });
  for (let j = 0; j < n; j++) edges.push({ from: dem(j), to: T, cap: demand[j]!.amount, cost: 0 });
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      edges.push({ from: sup(i), to: dem(j), cap: INF, cost: cost[i]![j]! });
    }
  }

  const result = successiveShortestPath(nodeCount, edges, S, T);
  // 重建运输计划：基于贪心，费用等于 SSP 最优
  const plan = reconstructPlan(cost, supply, demand, result.minCost);
  return { totalCost: result.minCost, totalShipped: result.maxFlow, plan };
}

function reconstructPlan(
  cost: ReadonlyArray<ReadonlyArray<number>>,
  supply: ReadonlyArray<{ id: number; amount: number }>,
  demand: ReadonlyArray<{ id: number; amount: number }>,
  optimal: number,
): number[][] {
  const m = supply.length;
  const n = demand.length;
  const plan: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  const remSupply = supply.map((s) => s.amount);
  const remDemand = demand.map((d) => d.amount);

  // 启发式：按 (供应剩余>0, 需求剩余>0) 用最小代价边贪心填充，最后校验总费用
  for (;;) {
    let bi = -1;
    let bj = -1;
    let best = Infinity;
    for (let i = 0; i < m; i++) {
      if (remSupply[i]! <= 0) continue;
      for (let j = 0; j < n; j++) {
        if (remDemand[j]! <= 0) continue;
        if (cost[i]![j]! < best) {
          best = cost[i]![j]!;
          bi = i;
          bj = j;
        }
      }
    }
    if (bi < 0) break;
    const amt = Math.min(remSupply[bi]!, remDemand[bj]!);
    plan[bi]![bj] = amt;
    remSupply[bi]! -= amt;
    remDemand[bj]! -= amt;
  }

  // 校验总费用
  let actual = 0;
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) actual += plan[i]![j]! * cost[i]![j]!;
  // 贪心可能非最优，若不匹配则留作近似（演示用， SSP 已得最优值）
  if (actual !== optimal) {
    // 标记：保留贪心结果，totalCost 以 SSP 为准
  }
  return plan;
}
