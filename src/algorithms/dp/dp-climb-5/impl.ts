// =============================================================================
// 爬楼梯（最多 k 步）· 纯算法实现
// =============================================================================
export interface ClimbKHooks {
  onStep?: (i: number, ways: number) => void;
  onDone?: (ways: number) => void;
}

export function climbStairsK(n: number, k: number, hooks: ClimbKHooks = {}): number {
  if (n === 0) {
    hooks.onDone?.(1);
    return 1;
  }
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  let window = 1;
  for (let i = 1; i <= n; i++) {
    if (i - k - 1 >= 0) window -= dp[i - k - 1]!;
    dp[i] = window;
    window += dp[i]!;
    hooks.onStep?.(i, dp[i]!);
  }
  hooks.onDone?.(dp[n]!);
  return dp[n]!;
}
