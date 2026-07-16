// 鸡尾酒排序（边界优化）· 纯算法实现
export interface CocktailBoundHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function cocktailSortBound(
  arr: readonly number[],
  hooks: CocktailBoundHooks = {},
): number[] {
  const a = [...arr];
  let lo = 0,
    hi = a.length - 1;
  while (lo < hi) {
    let newHi = lo;
    for (let i = lo; i < hi; i++) {
      hooks.onCompare?.(i, i + 1, a);
      if (a[i]! > a[i + 1]!) {
        [a[i], a[i + 1]] = [a[i + 1]!, a[i]!];
        newHi = i;
      }
    }
    hi = newHi;
    let newLo = hi;
    for (let i = hi; i > lo; i--) {
      hooks.onCompare?.(i - 1, i, a);
      if (a[i - 1]! > a[i]!) {
        [a[i - 1], a[i]] = [a[i]!, a[i - 1]!];
        newLo = i;
      }
    }
    lo = newLo;
  }
  return a;
}
