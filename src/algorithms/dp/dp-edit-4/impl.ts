// =============================================================================
// 编辑距离 · 纯算法实现
// =============================================================================
export interface EditDistHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onMatch?: (i: number, j: number) => void;
  onDone?: (dist: number) => void;
}

export function editDistance(a: string, b: string, hooks: EditDistHooks = {}): number {
  const n = a.length,
    m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, (_, i) => {
    const row = new Array<number>(m + 1);
    for (let j = 0; j <= m; j++) row[j] = i === 0 ? j : 0;
    if (i > 0) row[0] = i;
    return row;
  });
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
        hooks.onMatch?.(i, j);
      } else {
        dp[i]![j] = 1 + Math.min(dp[i - 1]![j - 1]!, dp[i - 1]![j]!, dp[i]![j - 1]!);
      }
      hooks.onCell?.(i, j, dp[i]![j]!);
    }
  }
  hooks.onDone?.(dp[n]![m]!);
  return dp[n]![m]!;
}
