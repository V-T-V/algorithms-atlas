// =============================================================================
// 二维矩阵搜索（Search a 2D Matrix）· 纯算法实现
// 每行升序、每行首元素大于上一行末元素（视为一维升序），二分 O(log(mn))。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Search2DHooks {
  /** 把一维下标 mid 映射到 (row,col) 并探测。 */
  onProbe?: (lo: number, hi: number, mid: number, row: number, col: number) => void;
  /** 区间收缩。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成。 */
  onDone?: (found: boolean, row: number, col: number) => void;
}

/**
 * 在行列均升序、行首大于上行末的矩阵中找 target。
 * @returns [row, col]；不存在返回 [-1, -1]。
 */
export function search2d(
  matrix: readonly (readonly number[])[],
  target: number,
  hooks: Search2DHooks = {},
): [number, number] {
  const m = matrix.length;
  if (m === 0) {
    hooks.onDone?.(false, -1, -1);
    return [-1, -1];
  }
  const n = matrix[0]!.length;
  if (n === 0) {
    hooks.onDone?.(false, -1, -1);
    return [-1, -1];
  }
  let lo = 0;
  let hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const row = Math.floor(mid / n);
    const col = mid % n;
    hooks.onProbe?.(lo, hi, mid, row, col);
    const v = matrix[row]![col]!;
    if (v === target) {
      hooks.onDone?.(true, row, col);
      return [row, col];
    } else if (v < target) {
      lo = mid + 1;
      hooks.onShrink?.(lo, hi, 'right');
    } else {
      hi = mid - 1;
      hooks.onShrink?.(lo, hi, 'left');
    }
  }
  hooks.onDone?.(false, -1, -1);
  return [-1, -1];
}
