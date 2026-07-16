// =============================================================================
// 网格收集金币 · 纯算法实现
// dp[i][j] = grid[i][j] + max(dp[i-1][j], dp[i][j-1])，边界单独处理。
// =============================================================================

export interface CoinsCollectHooks {
  onFill?: (i: number, j: number, val: number) => void;
  onPath?: (i: number, j: number) => void;
  onResult?: (total: number) => void;
}

export function coinsCollect(grid: number[][], hooks: CoinsCollectHooks = {}): number {
  const m = grid.length;
  if (m === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const n = grid[0]!.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const cur = grid[i]![j]!;
      if (i === 0 && j === 0) dp[i]![j] = cur;
      else if (i === 0) dp[i]![j] = dp[i]![j - 1]! + cur;
      else if (j === 0) dp[i]![j] = dp[i - 1]![j]! + cur;
      else dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!) + cur;
      hooks.onFill?.(i, j, dp[i]![j]!);
    }
  }
  const ans = dp[m - 1]![n - 1]!;
  // 回溯路径
  let i = m - 1;
  let j = n - 1;
  const path: Array<[number, number]> = [];
  while (i >= 0 && j >= 0) {
    path.push([i, j]);
    hooks.onPath?.(i, j);
    if (i === 0 && j === 0) break;
    if (i === 0) j--;
    else if (j === 0) i--;
    else if (dp[i - 1]![j]! >= dp[i]![j - 1]!) i--;
    else j--;
  }
  hooks.onResult?.(ans);
  return ans;
}
