// =============================================================================
// 两城调度 · 纯算法实现 (LeetCode 1029)
// costs[i] = [costA, costB]。按差值排序前 n 去 A。
// =============================================================================
export interface GreedyTwoCitySchedulingHooks {
  onAssign?: (person: number, city: 'A' | 'B', cost: number) => void;
  onConclude?: (total: number) => void;
}

export function greedyTwoCityScheduling(
  costs: ReadonlyArray<readonly [number, number]>,
  hooks: GreedyTwoCitySchedulingHooks = {},
): number {
  const n = costs.length / 2;
  const order = Array.from({ length: costs.length }, (_, i) => i);
  order.sort((a, b) => costs[a]![0]! - costs[a]![1]! - (costs[b]![0]! - costs[b]![1]!));

  let total = 0;
  order.forEach((idx, pos) => {
    if (pos < n) {
      total += costs[idx]![0]!;
      hooks.onAssign?.(idx, 'A', costs[idx]![0]!);
    } else {
      total += costs[idx]![1]!;
      hooks.onAssign?.(idx, 'B', costs[idx]![1]!);
    }
  });
  hooks.onConclude?.(total);
  return total;
}
