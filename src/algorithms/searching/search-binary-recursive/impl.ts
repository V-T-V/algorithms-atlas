// =============================================================================
// 二分查找（递归）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onCompare?: (mid: number, value: number, lo: number, hi: number) => void;
}

export function binarySearchRecursive(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  return helper(arr, target, 0, arr.length - 1, hooks);
}

function helper(
  arr: readonly number[],
  target: number,
  lo: number,
  hi: number,
  hooks: SearchHooks,
): number {
  if (lo > hi) return -1;
  const mid = (lo + hi) >> 1;
  hooks.onCompare?.(mid, arr[mid]!, lo, hi);
  if (arr[mid]! === target) return mid;
  if (arr[mid]! < target) return helper(arr, target, mid + 1, hi, hooks);
  return helper(arr, target, lo, mid - 1, hooks);
}
