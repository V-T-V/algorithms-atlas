// =============================================================================
// 寻找峰值（变体，二分）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onCompare?: (mid: number, midVal: number, nextVal: number, goRight: boolean) => void;
}

export function findPeak(arr: readonly number[], hooks: SearchHooks = {}): number {
  const n = arr.length;
  if (n === 0) throw new RangeError('数组不能为空');
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const next = arr[mid + 1]!;
    const goRight = arr[mid]! < next;
    hooks.onCompare?.(mid, arr[mid]!, next, goRight);
    if (goRight) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** 验证某索引确为峰值。 */
export function isPeak(arr: readonly number[], i: number): boolean {
  const n = arr.length;
  if (i < 0 || i >= n) return false;
  const left = i === 0 ? -Infinity : arr[i - 1]!;
  const right = i === n - 1 ? -Infinity : arr[i + 1]!;
  return arr[i]! >= left && arr[i]! >= right;
}
