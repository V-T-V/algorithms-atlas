// 双峰数组查找 · 纯算法实现
export interface Bitonic2Hooks {
  onPeak?: (peak: number) => void;
  onBinary?: (lo: number, hi: number) => void;
}

function bsearchAsc(arr: readonly number[], lo: number, hi: number, t: number): number {
  while (lo <= hi) {
    const m = (lo + hi) >>> 1;
    if (arr[m]! === t) return m;
    if (arr[m]! < t) lo = m + 1;
    else hi = m - 1;
  }
  return -1;
}
function bsearchDesc(arr: readonly number[], lo: number, hi: number, t: number): number {
  while (lo <= hi) {
    const m = (lo + hi) >>> 1;
    if (arr[m]! === t) return m;
    if (arr[m]! > t) lo = m + 1;
    else hi = m - 1;
  }
  return -1;
}

export function searchBitonic2(
  arr: readonly number[],
  target: number,
  hooks: Bitonic2Hooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  let lo = 0,
    hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid]! < arr[mid + 1]!) lo = mid + 1;
    else hi = mid;
  }
  const peak = lo;
  hooks.onPeak?.(peak);
  hooks.onBinary?.(0, peak);
  const left = bsearchAsc(arr, 0, peak, target);
  if (left !== -1) return left;
  hooks.onBinary?.(peak + 1, n - 1);
  return bsearchDesc(arr, peak + 1, n - 1, target);
}
