// =============================================================================
// 最大矩形 Maximal Rectangle · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 85）：0/1 矩阵中只含 1 的最大矩形面积。
// 采用「悬挂法 + 左右边界收缩」的 O(m·n) DP。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MaxRectangleHooks {
  /** 处理第 i 行时，更新悬挂高度 heights[j]。 */
  onUpdateHeights?: (row: number, heights: number[]) => void;
  /** 第 i 行求得一个候选矩形面积 area（宽 w × 高 h），位置列 [lo, lo+w)。 */
  onCandidate?: (row: number, lo: number, w: number, h: number, area: number) => void;
  /** 算法完成：最大面积。 */
  onDone?: (area: number) => void;
}

/**
 * 最大矩形（LeetCode 85）：给定 `0/1` 矩阵，求只含 `1` 的最大矩形面积。
 *
 * 「悬挂法」（largest rectangle in histogram 逐行升级）：\n- `heights[j]` = 当前列从当前行向上连续 `1` 的高度
 *   - 若 `matrix[i][j] === 1`：`heights[j] += 1`；否则 `heights[j] = 0`
 * - `left[j]` / `right[j]` = 以 `heights[j]` 为高的矩形可向左/右延伸到的边界（不含）
 *   - 利用上一行的边界「收缩」传递，使每行求左右边界仍是 `O(n)`
 * - 对每列 `j`：候选面积 `heights[j] * (right[j] - left[j])`，取全局最大
 *
 * 时间 `O(m·n)`，空间 `O(n)`。
 *
 * @param matrix 0/1 矩阵（元素可为 number 0/1 或字符 '0'/'1'）
 * @returns 最大全 1 矩形面积
 */
export function maxRectangle(
  matrix: ReadonlyArray<ReadonlyArray<string | number>>,
  hooks: MaxRectangleHooks = {},
): number {
  const m = matrix.length;
  if (m === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const n = matrix[0]!.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  const isOne = (i: number, j: number): boolean => {
    const v = matrix[i]![j]!;
    return v === 1 || v === '1';
  };

  const heights = new Array<number>(n).fill(0);
  const left = new Array<number>(n).fill(0); // 左边界（含）
  const right = new Array<number>(n).fill(n); // 右边界（不含）
  let best = 0;

  for (let i = 0; i < m; i++) {
    // 更新高度
    for (let j = 0; j < n; j++) {
      heights[j] = isOne(i, j) ? heights[j]! + 1 : 0;
    }
    hooks.onUpdateHeights?.(i, [...heights]);

    // 左边界
    let curLeft = 0;
    for (let j = 0; j < n; j++) {
      if (isOne(i, j)) left[j] = Math.max(left[j]!, curLeft);
      else {
        left[j] = 0;
        curLeft = j + 1;
      }
    }
    // 右边界
    let curRight = n;
    for (let j = n - 1; j >= 0; j--) {
      if (isOne(i, j)) right[j] = Math.min(right[j]!, curRight);
      else {
        right[j] = n;
        curRight = j;
      }
    }
    // 候选面积
    for (let j = 0; j < n; j++) {
      const w = right[j]! - left[j]!;
      const h = heights[j]!;
      const area = w * h;
      if (area > best) best = area;
      if (h > 0) hooks.onCandidate?.(i, left[j]!, w, h, area);
    }
  }

  hooks.onDone?.(best);
  return best;
}
