// =============================================================================
// 二分查找（迭代）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onCompare?: (mid: number, value: number, lo: number, hi: number) => void;
}

export function binarySearchIterative(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    hooks.onCompare?.(mid, arr[mid]!, lo, hi);
    if (arr[mid]! === target) return mid;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
