// 查找不动点 · 纯算法实现
export interface FixedPointHooks {
  onCompare?: (mid: number) => void;
}

export function findFixedPoint(arr: readonly number[], hooks: FixedPointHooks = {}): number {
  let lo = 0,
    hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! === mid) return mid;
    if (arr[mid]! < mid) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
