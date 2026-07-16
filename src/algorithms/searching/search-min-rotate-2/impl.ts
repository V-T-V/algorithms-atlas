// 旋转数组最小值 · 纯算法实现
export interface MinRotate2Hooks {
  onCompare?: (mid: number) => void;
}

export function findMinRotated2(arr: readonly number[], hooks: MinRotate2Hooks = {}): number {
  let lo = 0,
    hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! < arr[hi]!) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
