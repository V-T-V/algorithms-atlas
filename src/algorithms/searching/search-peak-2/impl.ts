// 查找峰值（二分）· 纯算法实现
export interface Peak2Hooks {
  onCompare?: (mid: number) => void;
}

export function findPeak2(arr: readonly number[], hooks: Peak2Hooks = {}): number {
  let lo = 0,
    hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! < arr[mid + 1]!) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
