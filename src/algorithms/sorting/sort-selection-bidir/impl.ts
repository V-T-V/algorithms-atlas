// 选择排序（双向）· 纯算法实现
export interface SelectionBidirHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function selectionSortBidir(
  arr: readonly number[],
  hooks: SelectionBidirHooks = {},
): number[] {
  const a = [...arr];
  let lo = 0,
    hi = a.length - 1;
  while (lo < hi) {
    let mn = lo,
      mx = lo;
    for (let i = lo + 1; i <= hi; i++) {
      hooks.onCompare?.(i, mn, a);
      if (a[i]! < a[mn]!) mn = i;
      if (a[i]! >= a[mx]!) mx = i;
    }
    [a[lo], a[mn]] = [a[mn]!, a[lo]!];
    if (mx === lo) mx = mn;
    [a[hi], a[mx]] = [a[mx]!, a[hi]!];
    lo++;
    hi--;
  }
  return a;
}
