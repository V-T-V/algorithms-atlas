// =============================================================================
// 二分查找最左位置（lower_bound）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onCompare?: (mid: number, value: number, lo: number, hi: number) => void;
}

/** 返回第一个 >= target 的索引（即 target 的最左出现，或插入位置）。 */
export function lowerBound(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    hooks.onCompare?.(mid, arr[mid]!, lo, hi);
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** 找 target 的最左出现索引；不存在返回 -1。 */
export function binarySearchLeftmost(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  const idx = lowerBound(arr, target, hooks);
  if (idx < arr.length && arr[idx]! === target) return idx;
  return -1;
}
