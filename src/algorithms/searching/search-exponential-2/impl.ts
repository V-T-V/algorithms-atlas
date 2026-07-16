// =============================================================================
// 指数查找（变体）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onBound?: (bound: number, value: number | null) => void;
  onBinary?: (mid: number, value: number) => void;
}

export function exponentialSearch(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  if (arr[0] === target) return 0;
  // 倍增找边界
  let bound = 1;
  while (bound < n && arr[bound]! < target) {
    hooks.onBound?.(bound, arr[bound]!);
    bound *= 2;
  }
  hooks.onBound?.(bound, bound < n ? arr[bound]! : null);
  // 二分查找 [bound/2, min(bound, n-1)]
  let lo = Math.floor(bound / 2);
  let hi = Math.min(bound, n - 1);
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    hooks.onBinary?.(mid, arr[mid]!);
    if (arr[mid]! === target) return mid;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
