// =============================================================================
// 最小路径和 Min Path Sum · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 64）：从网格左上到右下，每步只向右或向下，求路径最小和。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MinPathHooks {
  /** dp[i][j] 已求值：从 (0,0) 到 (i,j) 的最小路径和。 */
  onFillCell?: (i: number, j: number, val: number) => void;
  /** 回溯：路径经过 (i,j)。 */
  onPath?: (i: number, j: number) => void;
  /** 算法完成：最小和。 */
  onDone?: (total: number) => void;
}

/**
 * 最小路径和（LeetCode 64）：从 `grid` 左上 `(0,0)` 到右下 `(m-1,n-1)`，
 * 每步只能向右或向下，求经过格子数值之和最小的路径的和。
 *
 * 二维 DP（原地或拷贝）：`dp[i][j]` = 从 `(0,0)` 到 `(i,j)` 的最小路径和。
 *   - `dp[0][0] = grid[0][0]`
 *   - `dp[0][j] = dp[0][j-1] + grid[0][j]`（首行只能来自左）
 *   - `dp[i][0] = dp[i-1][0] + grid[i][0]`（首列只能来自上）
 *   - `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`
 *   - 答案 = `dp[m-1][n-1]`
 *
 * 时间 `O(m·n)`，空间 `O(m·n)`（可滚动到 `O(n)`，但本实现保留全表以便回溯路径）。
 *
 * @param grid 非空二维数值网格
 * @returns 最小路径和
 */
export function minimumPath(
  grid: ReadonlyArray<ReadonlyArray<number>>,
  hooks: MinPathHooks = {},
): number {
  const m = grid.length;
  if (m === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const n = grid[0]!.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  dp[0]![0] = grid[0]![0]!;
  hooks.onFillCell?.(0, 0, dp[0]![0]!);

  for (let j = 1; j < n; j++) {
    dp[0]![j] = dp[0]![j - 1]! + grid[0]![j]!;
    hooks.onFillCell?.(0, j, dp[0]![j]!);
  }
  for (let i = 1; i < m; i++) {
    dp[i]![0] = dp[i - 1]![0]! + grid[i]![0]!;
    hooks.onFillCell?.(i, 0, dp[i]![0]!);
  }
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i]![j] = grid[i]![j]! + Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!);
      hooks.onFillCell?.(i, j, dp[i]![j]!);
    }
  }

  // 回溯路径（从右下到左上，选 min 的来源）
  const path: Array<[number, number]> = [];
  let i = m - 1;
  let j = n - 1;
  while (true) {
    path.push([i, j]);
    hooks.onPath?.(i, j);
    if (i === 0 && j === 0) break;
    if (i === 0) j--;
    else if (j === 0) i--;
    else if (dp[i - 1]![j]! <= dp[i]![j - 1]!) i--;
    else j--;
  }
  path.reverse();

  hooks.onDone?.(dp[m - 1]![n - 1]!);
  return dp[m - 1]![n - 1]!;
}
