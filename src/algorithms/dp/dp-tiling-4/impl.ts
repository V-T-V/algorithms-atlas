// =============================================================================
// 多米诺铺砖 2×N · 纯算法实现
// =============================================================================
export interface TilingHooks {
  onCol?: (i: number, ways: number) => void;
  onDone?: (ways: number) => void;
}

export function dominoTiling(n: number, hooks: TilingHooks = {}): number {
  if (n < 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  if (n >= 1) dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    hooks.onCol?.(i, dp[i]!);
  }
  hooks.onDone?.(dp[n]!);
  return dp[n]!;
}
