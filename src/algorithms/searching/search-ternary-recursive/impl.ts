// =============================================================================
// 三分查找（递归）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onCompare?: (m1: number, m2: number, lo: number, hi: number) => void;
}

export function ternarySearchRecursive(
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
  const third = Math.floor((hi - lo) / 3);
  const m1 = lo + third;
  const m2 = hi - third;
  hooks.onCompare?.(m1, m2, lo, hi);
  if (arr[m1]! === target) return m1;
  if (arr[m2]! === target) return m2;
  if (target < arr[m1]!) return helper(arr, target, lo, m1 - 1, hooks);
  if (target > arr[m2]!) return helper(arr, target, m2 + 1, hi, hooks);
  return helper(arr, target, m1 + 1, m2 - 1, hooks);
}
