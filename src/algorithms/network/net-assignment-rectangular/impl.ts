// 矩形分配问题 · 实现

import { successiveShortestPath } from '../successive-shortest-path/impl.ts';

export interface RectAssignmentResult {
  totalCost: number;
  /** pairs[k] = { worker, task } 仅含真实配对（非虚拟）。 */
  pairs: Array<{ worker: number; task: number; cost: number }>;
}

/** m×n 代价矩阵的最小代价矩形分配。 */
export function rectangularAssignment(
  cost: ReadonlyArray<ReadonlyArray<number>>,
): RectAssignmentResult {
  const m = cost.length;
  if (m === 0) return { totalCost: 0, pairs: [] };
  const n = cost[0]!.length;
  const size = Math.max(m, n);
  // 补方阵：虚拟行/列代价 0
  const square: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      row.push(i < m && j < n ? cost[i]![j]! : 0);
    }
    square.push(row);
  }

  // 节点：0=S, 1..size=工人, size+1..2size=任务, 2size+1=T
  const S = 0;
  const T = 2 * size + 1;
  const worker = (i: number): number => i + 1;
  const task = (j: number): number => size + 1 + j;
  const nodeCount = 2 * size + 2;

  const edges: Array<{ from: number; to: number; cap: number; cost: number }> = [];
  for (let i = 0; i < size; i++) edges.push({ from: S, to: worker(i), cap: 1, cost: 0 });
  for (let j = 0; j < size; j++) edges.push({ from: task(j), to: T, cap: 1, cost: 0 });
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      edges.push({ from: worker(i), to: task(j), cap: 1, cost: square[i]![j]! });
    }
  }

  const result = successiveShortestPath(nodeCount, edges, S, T);
  const pairs = reconstructPairs(cost, m, n, result.minCost);
  return { totalCost: result.minCost, pairs };
}

/** 回溯真实配对（i<m 且 j<n）。 */
function reconstructPairs(
  cost: ReadonlyArray<ReadonlyArray<number>>,
  m: number,
  n: number,
  optimal: number,
): Array<{ worker: number; task: number; cost: number }> {
  const pairs: Array<{ worker: number; task: number; cost: number }> = [];
  const assignW = new Array<number>(m).fill(-1);
  const usedT = new Array<boolean>(n).fill(false);
  const tryMatch = (i: number, acc: number): boolean => {
    if (i === m) return acc === optimal;
    for (let j = 0; j < n; j++) {
      if (usedT[j]) continue;
      usedT[j] = true;
      assignW[i] = j;
      if (tryMatch(i + 1, acc + cost[i]![j]!)) {
        usedT[j] = false;
        return true;
      }
      usedT[j] = false;
      assignW[i] = -1;
    }
    // 工人 i 可不配对（当 m>n 时）
    if (tryMatch(i + 1, acc)) return true;
    return false;
  };
  tryMatch(0, 0);
  for (let i = 0; i < m; i++) {
    if (assignW[i]! >= 0)
      pairs.push({ worker: i, task: assignW[i]!, cost: cost[i]![assignW[i]!]! });
  }
  return pairs;
}
