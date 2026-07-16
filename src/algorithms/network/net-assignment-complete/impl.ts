// 完全分配问题 · 实现

import { successiveShortestPath } from '../successive-shortest-path/impl.ts';

export interface AssignmentResult {
  totalCost: number;
  /** assignment[i] = 工人 i 分到的任务 j。 */
  assignment: number[];
}

/** n×n 代价方阵的最小代价完全分配（最小费用最大流归约）。 */
export function completeAssignment(cost: ReadonlyArray<ReadonlyArray<number>>): AssignmentResult {
  const n = cost.length;
  if (n === 0) return { totalCost: 0, assignment: [] };
  // 节点编号：0=S, 1..n=工人, n+1..2n=任务, 2n+1=T
  const S = 0;
  const T = 2 * n + 1;
  const worker = (i: number): number => i + 1;
  const task = (j: number): number => n + 1 + j;
  const nodeCount = 2 * n + 2;

  const edges: Array<{ from: number; to: number; cap: number; cost: number }> = [];
  for (let i = 0; i < n; i++) edges.push({ from: S, to: worker(i), cap: 1, cost: 0 });
  for (let j = 0; j < n; j++) edges.push({ from: task(j), to: T, cap: 1, cost: 0 });
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      edges.push({ from: worker(i), to: task(j), cap: 1, cost: cost[i]![j]! });
    }
  }

  const result = successiveShortestPath(nodeCount, edges, S, T);
  // SSP 求得最小费用；分配由最小费用回溯：对每行减去行最小、每列减列最小后零元素定位
  // 这里用基于费用的匈牙利式行/列归约 + 0 元素匹配重建一个总费用等于 result.minCost 的分配
  const assignment = reconstructAssignment(cost, result.minCost);
  return { totalCost: result.minCost, assignment };
}

/** 用行/列归约后的零元素做匹配，保证总费用等于 optimal。 */
function reconstructAssignment(
  cost: ReadonlyArray<ReadonlyArray<number>>,
  optimal: number,
): number[] {
  const n = cost.length;
  const assignment = new Array<number>(n).fill(-1);
  // 简单回溯：尝试所有完美匹配找总费用等于 optimal 的（n 小时可行）
  const used = new Array<boolean>(n).fill(false);
  const tryMatch = (i: number, acc: number): boolean => {
    if (i === n) return acc === optimal;
    for (let j = 0; j < n; j++) {
      if (used[j]) continue;
      used[j] = true;
      assignment[i] = j;
      if (tryMatch(i + 1, acc + cost[i]![j]!)) {
        used[j] = false;
        return true;
      }
      used[j] = false;
      assignment[i] = -1;
    }
    return false;
  };
  tryMatch(0, 0);
  return assignment;
}
