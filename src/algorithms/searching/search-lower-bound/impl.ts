// 下界二分查找 · 纯算法实现
export interface LowerBoundHooks {
  onCompare?: (mid: number) => void;
}

export function lowerBound(
  arr: readonly number[],
  target: number,
  hooks: LowerBoundHooks = {},
): number {
  let lo = 0,
    hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
