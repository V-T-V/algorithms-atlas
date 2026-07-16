// 二分查找（递归最左）· 纯算法实现
export interface LeftRecurHooks {
  onCompare?: (mid: number) => void;
}

function rec(
  a: readonly number[],
  target: number,
  lo: number,
  hi: number,
  ans: number,
  hooks: LeftRecurHooks,
): number {
  if (lo > hi) return ans;
  const mid = (lo + hi) >>> 1;
  hooks.onCompare?.(mid);
  if (a[mid]! === target) return rec(a, target, lo, mid - 1, mid, hooks);
  if (a[mid]! < target) return rec(a, target, mid + 1, hi, ans, hooks);
  return rec(a, target, lo, mid - 1, ans, hooks);
}

export function binarySearchLeftmostRecursive(
  arr: readonly number[],
  target: number,
  hooks: LeftRecurHooks = {},
): number {
  return rec(arr, target, 0, arr.length - 1, -1, hooks);
}
