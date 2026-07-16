// =============================================================================
// 爬楼梯（带障碍）
// =============================================================================

export interface ClimbStairsHooks {
  onStep?: (i: number, val: number, blocked: boolean) => void;
  onDone?: (ways: number) => void;
}

export function climbStairsObstacle(
  blocked: readonly boolean[],
  hooks: ClimbStairsHooks = {},
): number {
  const n = blocked.length;
  if (n === 0) {
    hooks.onDone?.(1);
    return 1;
  }
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
    if (blocked[i - 1]!) {
      dp[i] = 0;
      hooks.onStep?.(i, 0, true);
      continue;
    }
    let v = dp[i - 1]!;
    if (i >= 2) v += dp[i - 2]!;
    dp[i] = v;
    hooks.onStep?.(i, v, false);
  }
  hooks.onDone?.(dp[n]!);
  return dp[n]!;
}
