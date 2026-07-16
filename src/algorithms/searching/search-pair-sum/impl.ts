// 两数之和（有序双指针）· 纯算法实现
export interface PairSumHooks {
  onCompare?: (lo: number, hi: number) => void;
}

export function twoSumSorted(
  arr: readonly number[],
  target: number,
  hooks: PairSumHooks = {},
): [number, number] {
  let lo = 0,
    hi = arr.length - 1;
  while (lo < hi) {
    hooks.onCompare?.(lo, hi);
    const s = arr[lo]! + arr[hi]!;
    if (s === target) return [lo, hi];
    if (s < target) lo++;
    else hi--;
  }
  return [-1, -1];
}
