// 鸡尾酒排序（朴素）· 纯算法实现
export interface ShakerNaiveHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function shakerSortNaive(arr: readonly number[], hooks: ShakerNaiveHooks = {}): number[] {
  const a = [...arr];
  let swapped = true;
  let lo = 0,
    hi = a.length - 1;
  while (swapped) {
    swapped = false;
    for (let i = lo; i < hi; i++) {
      hooks.onCompare?.(i, i + 1, a);
      if (a[i]! > a[i + 1]!) {
        [a[i], a[i + 1]] = [a[i + 1]!, a[i]!];
        swapped = true;
      }
    }
    hi--;
    for (let i = hi; i > lo; i--) {
      hooks.onCompare?.(i - 1, i, a);
      if (a[i - 1]! > a[i]!) {
        [a[i - 1], a[i]] = [a[i]!, a[i - 1]!];
        swapped = true;
      }
    }
    lo++;
  }
  return a;
}
