// =============================================================================
// 最大正方形 Maximal Square · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 221）：0/1 矩阵中全 1 子正方形的最大边长。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MaximalSquareHooks {
  /** dp[i][j] 已求值：以 (i,j) 为右下角的全 1 正方形最大边长。 */
  onFillCell?: (i: number, j: number, val: number) => void;
  /** 算法完成：最大边长（面积为边长²）。 */
  onDone?: (side: number, area: number) => void;
}

/**
 * 最大正方形（LeetCode 221）：给定 `0/1` 矩阵，求全 `1` 子正方形的最大面积。
 *
 * 状态：`dp[i][j]` = 以 `(i,j)` 为右下角的全 `1` 正方形最大边长。
 *   - 若 `matrix[i][j] === 0`：`dp[i][j] = 0`
 *   - 否则：`dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`
 *
 * 直觉：以 `(i,j)` 为右下角能撑多大的正方形，受其左、上、左上三处的瓶颈限制。
 * 答案 = 全局最大 `dp[i][j]`，面积 = `side²`。
 *
 * 时间 `O(m·n)`，空间 `O(m·n)`（可滚动到 `O(n)`）。
 *
 * @param matrix 0/1 矩阵（元素可为 number 0/1 或字符 '0'/'1'）
 * @returns 最大正方形边长
 */
export function maximalSquare(
  matrix: ReadonlyArray<ReadonlyArray<string | number>>,
  hooks: MaximalSquareHooks = {},
): number {
  const m = matrix.length;
  if (m === 0) {
    hooks.onDone?.(0, 0);
    return 0;
  }
  const n = matrix[0]!.length;
  if (n === 0) {
    hooks.onDone?.(0, 0);
    return 0;
  }

  const isOne = (i: number, j: number): boolean => {
    const v = matrix[i]![j]!;
    return v === 1 || v === '1';
  };

  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  let best = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (!isOne(i, j)) {
        dp[i]![j] = 0;
      } else if (i === 0 || j === 0) {
        dp[i]![j] = 1;
      } else {
        dp[i]![j] = 1 + Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!, dp[i - 1]![j - 1]!);
      }
      if (dp[i]![j]! > best) best = dp[i]![j]!;
      hooks.onFillCell?.(i, j, dp[i]![j]!);
    }
  }

  hooks.onDone?.(best, best * best);
  return best;
}
