// =============================================================================
// 棋盘路径计数 · 纯算法实现
// dp[i][j] = dp[i-1][j] + dp[i][j-1]；第一行第一列全 1。
// =============================================================================

export interface ChessboardHooks {
  onFill?: (i: number, j: number, val: number) => void;
  onResult?: (count: number) => void;
}

export function chessboardPaths(m: number, n: number, hooks: ChessboardHooks = {}): number {
  if (m <= 0 || n <= 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 || j === 0) dp[i]![j] = 1;
      else dp[i]![j] = dp[i - 1]![j]! + dp[i]![j - 1]!;
      hooks.onFill?.(i, j, dp[i]![j]!);
    }
  }
  const ans = dp[m - 1]![n - 1]!;
  hooks.onResult?.(ans);
  return ans;
}
