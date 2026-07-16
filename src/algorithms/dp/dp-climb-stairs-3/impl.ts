// =============================================================================
// 爬楼梯（变步长）· 纯算法实现
// =============================================================================

export interface ClimbStairsVarHooks {
  onInit?: (n: number) => void;
  onUpdate?: (i: number, val: number) => void;
  onDone?: (ways: number) => void;
}

export function climbStairsVar(
  n: number,
  steps: readonly number[],
  hooks: ClimbStairsVarHooks = {},
): number {
  if (n < 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  hooks.onInit?.(n);
  for (let i = 1; i <= n; i++) {
    for (const s of steps) {
      if (s <= i) dp[i]! += dp[i - s]!;
    }
    hooks.onUpdate?.(i, dp[i]!);
  }
  hooks.onDone?.(dp[n]!);
  return dp[n]!;
}
