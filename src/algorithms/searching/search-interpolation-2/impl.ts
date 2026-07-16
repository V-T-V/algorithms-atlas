// =============================================================================
// 插值查找（变体）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onProbe?: (pos: number, value: number, lo: number, hi: number) => void;
}

export function interpolationSearch(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  let lo = 0;
  let hi = n - 1;
  while (lo <= hi && target >= arr[lo]! && target <= arr[hi]!) {
    // 全相等的情况
    if (arr[lo]! === arr[hi]!) {
      return arr[lo]! === target ? lo : -1;
    }
    const pos = lo + Math.floor(((hi - lo) * (target - arr[lo]!)) / (arr[hi]! - arr[lo]!));
    hooks.onProbe?.(pos, arr[pos]!, lo, hi);
    if (arr[pos]! === target) return pos;
    if (arr[pos]! < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}
