// =============================================================================
// 不同路径 Unique Paths · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 62）：m×n 网格从左上到右下，每步右/下，求路径条数。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface UniquePathsHooks {
  /** dp[i][j] 已求值：从 (0,0) 到 (i,j) 的路径数。 */
  onFillCell?: (i: number, j: number, val: number) => void;
  /** 算法完成：总路径数。 */
  onDone?: (total: number) => void;
}

/**
 * 不同路径（LeetCode 62）：机器人位于 `m×n` 网格左上角，每次只能向下或向右，求到右下角的路径数。
 *
 * 二维 DP：`dp[i][j]` = 从 `(0,0)` 到 `(i,j)` 的路径数。
 *   - `dp[0][0] = 1`；首行/首列恒 1（只能一直走到底）
 *   - `dp[i][j] = dp[i-1][j] + dp[i][j-1]`
 *   - 答案 = `dp[m-1][n-1]`
 *
 * 等价于组合数 `C(m+n-2, m-1)`。时间 `O(m·n)`，空间 `O(m·n)`（可滚动到 `O(n)`）。
 *
 * @param m 行数（≥1）
 * @param n 列数（≥1）
 * @returns 路径总数
 */
export function uniquePaths(m: number, n: number, hooks: UniquePathsHooks = {}): number {
  if (m <= 0 || n <= 0) {
    hooks.onDone?.(0);
    return 0;
  }

  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 || j === 0) dp[i]![j] = 1;
      else dp[i]![j] = dp[i - 1]![j]! + dp[i]![j - 1]!;
      hooks.onFillCell?.(i, j, dp[i]![j]!);
    }
  }

  hooks.onDone?.(dp[m - 1]![n - 1]!);
  return dp[m - 1]![n - 1]!;
}
