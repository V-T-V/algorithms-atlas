// =============================================================================
// 爬楼梯最小代价（滚动数组版本）· 纯算法实现
// 用两个变量 a/b 滚动推进，空间 O(1)。
// =============================================================================

export interface StairsMinCostHooks {
  onStep?: (i: number, val: number) => void;
  onResult?: (total: number) => void;
}

export function climbingStairsMinCost(
  cost: readonly number[],
  hooks: StairsMinCostHooks = {},
): number {
  const n = cost.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  if (n === 1) {
    hooks.onStep?.(0, cost[0]!);
    hooks.onResult?.(0);
    return 0;
  }
  let a = cost[0]!;
  let b = cost[1]!;
  hooks.onStep?.(0, a);
  hooks.onStep?.(1, b);
  let cur = 0;
  for (let i = 2; i < n; i++) {
    cur = Math.min(a, b) + cost[i]!;
    a = b;
    b = cur;
    hooks.onStep?.(i, cur);
  }
  const ans = Math.min(a, b);
  hooks.onResult?.(ans);
  return ans;
}
