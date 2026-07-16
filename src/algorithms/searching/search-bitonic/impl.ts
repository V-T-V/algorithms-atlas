// =============================================================================
// 双调数组查找 · 纯算法实现
// =============================================================================

import { findPeak } from '../search-peak-find-2/impl.ts';

export interface SearchHooks {
  onPeak?: (peak: number) => void;
  onAscSearch?: (mid: number, value: number) => void;
  onDescSearch?: (mid: number, value: number) => void;
}

/** 找峰值索引（双调数组的最大值位置）。 */
function findBitonicPeak(arr: readonly number[]): number {
  return findPeak(arr);
}

/** 升序二分（找 [lo, hi] 中 target）。 */
function ascBinarySearch(
  arr: readonly number[],
  lo: number,
  hi: number,
  target: number,
  hooks: SearchHooks,
): number {
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    hooks.onAscSearch?.(mid, arr[mid]!);
    if (arr[mid]! === target) return mid;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

/** 降序二分（找 [lo, hi] 中 target，数组该段递减）。 */
function descBinarySearch(
  arr: readonly number[],
  lo: number,
  hi: number,
  target: number,
  hooks: SearchHooks,
): number {
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    hooks.onDescSearch?.(mid, arr[mid]!);
    if (arr[mid]! === target) return mid;
    if (arr[mid]! > target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

export function bitonicSearch(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  const peak = findBitonicPeak(arr);
  hooks.onPeak?.(peak);
  // 先查升序段 [0, peak]
  const left = ascBinarySearch(arr, 0, peak, target, hooks);
  if (left !== -1) return left;
  // 再查降序段 [peak+1, n-1]
  if (peak + 1 < n) {
    return descBinarySearch(arr, peak + 1, n - 1, target, hooks);
  }
  return -1;
}

export { findBitonicPeak };
