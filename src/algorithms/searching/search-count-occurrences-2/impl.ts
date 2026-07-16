// 统计出现次数 · 纯算法实现
export interface CountOcc2Hooks {
  onBound?: (which: 'lower' | 'upper', idx: number) => void;
}

export function countOccurrences2(
  arr: readonly number[],
  target: number,
  hooks: CountOcc2Hooks = {},
): number {
  const n = arr.length;
  let lo = 0,
    hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  const lower = lo;
  hooks.onBound?.('lower', lower);
  lo = lower;
  hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid]! <= target) lo = mid + 1;
    else hi = mid;
  }
  const upper = lo;
  hooks.onBound?.('upper', upper);
  return upper - lower;
}
