// =============================================================================
// 三角形最小路径 Triangle · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 120）：三角形顶部到底部的最小路径和，每步只能走到下一行相邻下标。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface TriangleHooks {
  /** dp[i][j] 已求值：从顶部到 (i,j) 的最小路径和。 */
  onFillCell?: (i: number, j: number, val: number) => void;
  /** 回溯：最优路径经过 (i,j)。 */
  onPath?: (i: number, j: number) => void;
  /** 算法完成：最小路径和。 */
  onDone?: (total: number) => void;
}

/**
 * 三角形最小路径和（LeetCode 120）。
 *
 * 三角形 `triangle[i]` 是第 i 行（长度 i+1）。从顶 `(0,0)` 走到底部，每步从 `(i,j)` 可走到 `(i+1,j)` 或 `(i+1,j+1)`，求路径最小和。
 *
 * 二维 DP（自顶向下）：`dp[i][j]` = 从顶到 `(i,j)` 的最小路径和。
 *   - `dp[0][0] = triangle[0][0]`
 *   - 行首 `dp[i][0] = dp[i-1][0] + triangle[i][0]`（只能来自左上 j=0）
 *   - 行尾 `dp[i][i] = dp[i-1][i-1] + triangle[i][i]`（只能来自左上 j=i-1）
 *   - 中间 `dp[i][j] = triangle[i][j] + min(dp[i-1][j-1], dp[i-1][j])`
 *   - 答案 = `min(dp[n-1][*])`
 *
 * 时间 `O(n²)`，空间 `O(n²)`（可滚动到 `O(n)`；也可自底向上原地更新）。
 *
 * @param triangle 三角形数值数组（triangle[i].length === i+1）
 * @returns 最小路径和
 */
export function triangle(
  tri: ReadonlyArray<ReadonlyArray<number>>,
  hooks: TriangleHooks = {},
): number {
  const n = tri.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(0));
  dp[0]![0] = tri[0]![0]!;
  hooks.onFillCell?.(0, 0, dp[0]![0]!);

  for (let i = 1; i < n; i++) {
    dp[i] = new Array<number>(i + 1).fill(0);
    dp[i]![0] = dp[i - 1]![0]! + tri[i]![0]!;
    hooks.onFillCell?.(i, 0, dp[i]![0]!);
    for (let j = 1; j < i; j++) {
      dp[i]![j] = tri[i]![j]! + Math.min(dp[i - 1]![j - 1]!, dp[i - 1]![j]!);
      hooks.onFillCell?.(i, j, dp[i]![j]!);
    }
    dp[i]![i] = dp[i - 1]![i - 1]! + tri[i]![i]!;
    hooks.onFillCell?.(i, i, dp[i]![i]!);
  }

  // 最后一行取最小
  let best = Infinity;
  let bestJ = 0;
  for (let j = 0; j < n; j++) {
    if (dp[n - 1]![j]! < best) {
      best = dp[n - 1]![j]!;
      bestJ = j;
    }
  }

  // 回溯路径
  let j = bestJ;
  for (let i = n - 1; i >= 0; i--) {
    hooks.onPath?.(i, j);
    // 上一行的来源：若 j==i，只能来自 j-1；若 j==0 只能来自 0；否则取 min 的来源
    if (i === 0) break;
    if (j === i) j = j - 1;
    else if (j === 0) j = 0;
    else if (dp[i - 1]![j - 1]! <= dp[i - 1]![j]!) j = j - 1;
  }

  hooks.onDone?.(best);
  return best;
}
