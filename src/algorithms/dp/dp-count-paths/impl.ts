// =============================================================================
// 统计路径数 DP · 纯算法实现
// 网格从 (0,0) 到 (m-1,n-1)，每步只能向右或向下，求不同路径数。
// dp[i][j] = dp[i-1][j] + dp[i][j-1]，边界 dp[0][*]=dp[*][0]=1。
// =============================================================================

export interface CountPathsHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onResult?: (total: number) => void;
}

export function countPaths(m: number, n: number, hooks: CountPathsHooks = {}): number {
  if (m <= 0 || n <= 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 || j === 0) dp[i]![j] = 1;
      else dp[i]![j] = dp[i - 1]![j]! + dp[i]![j - 1]!;
      hooks.onCell?.(i, j, dp[i]![j]!);
    }
  }
  hooks.onResult?.(dp[m - 1]![n - 1]!);
  return dp[m - 1]![n - 1]!;
}
