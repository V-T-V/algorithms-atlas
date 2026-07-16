// =============================================================================
// 最小代价爬楼梯 · 纯算法实现
// 每阶 cost[i]，可从第 i 阶爬 1 或 2 阶；从下标 0 或 1 起步，跨过顶层为终。
// dp[i] = 到达第 i 阶的最小累计代价；dp[0]=cost[0], dp[1]=cost[1]（或 0/0 视约定）。
// 这里采用 LeetCode 746 约定：起步不付费，离开某阶时付费。
// dp[i] = min(dp[i-1], dp[i-2]) + cost[i]，答案 = min(dp[n-1], dp[n-2])。
// =============================================================================

export interface MinCostHooks {
  onStep?: (i: number, val: number) => void;
  onResult?: (total: number) => void;
}

export function minCostClimbingStairs(cost: readonly number[], hooks: MinCostHooks = {}): number {
  const n = cost.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  if (n === 1) {
    hooks.onStep?.(0, cost[0]!);
    hooks.onResult?.(0); // 直接跨过
    return 0;
  }
  const dp: number[] = new Array<number>(n).fill(0);
  dp[0] = cost[0]!;
  dp[1] = cost[1]!;
  hooks.onStep?.(0, dp[0]);
  hooks.onStep?.(1, dp[1]);
  for (let i = 2; i < n; i++) {
    dp[i] = Math.min(dp[i - 1]!, dp[i - 2]!) + cost[i]!;
    hooks.onStep?.(i, dp[i]!);
  }
  const ans = Math.min(dp[n - 1]!, dp[n - 2]!);
  hooks.onResult?.(ans);
  return ans;
}
