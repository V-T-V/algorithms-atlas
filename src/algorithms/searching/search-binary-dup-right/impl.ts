// =============================================================================
// 二分查找最右位置（upper_bound - 1）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onCompare?: (mid: number, value: number, lo: number, hi: number) => void;
}

/** 返回第一个 > target 的索引（upper bound）。 */
export function upperBound(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    hooks.onCompare?.(mid, arr[mid]!, lo, hi);
    if (arr[mid]! <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** 找 target 的最右出现索引；不存在返回 -1。 */
export function binarySearchRightmost(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  const idx = upperBound(arr, target, hooks) - 1;
  if (idx >= 0 && arr[idx]! === target) return idx;
  return -1;
}
