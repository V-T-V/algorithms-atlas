// 区间内元素计数 · 纯算法实现
export interface CountRangeHooks {
  onBound?: (idx: number) => void;
}

export function countInRange(
  arr: readonly number[],
  loVal: number,
  hiVal: number,
  hooks: CountRangeHooks = {},
): number {
  const n = arr.length;
  let lo = 0,
    hi = n;
  while (lo < hi) {
    const m = (lo + hi) >>> 1;
    if (arr[m]! < loVal) lo = m + 1;
    else hi = m;
  }
  const lower = lo;
  hooks.onBound?.(lower);
  hi = n;
  while (lo < hi) {
    const m = (lo + hi) >>> 1;
    if (arr[m]! <= hiVal) lo = m + 1;
    else hi = m;
  }
  const upper = lo;
  hooks.onBound?.(upper);
  return Math.max(0, upper - lower);
}
