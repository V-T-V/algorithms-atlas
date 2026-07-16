// 归并排序（自底向上）· 纯算法实现
export interface MergeBottomUpHooks {
  onMerge?: (lo: number, mid: number, hi: number, arr: number[]) => void;
}

export function mergeSortBottomUp(
  arr: readonly number[],
  hooks: MergeBottomUpHooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  const aux = new Array<number>(n);
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      for (let k = lo; k < hi; k++) aux[k] = a[k]!;
      let i = lo,
        j = mid,
        k = lo;
      while (i < mid && j < hi) {
        if (aux[i]! <= aux[j]!) a[k++] = aux[i++]!;
        else a[k++] = aux[j++]!;
      }
      while (i < mid) a[k++] = aux[i++]!;
      while (j < hi) a[k++] = aux[j++]!;
      hooks.onMerge?.(lo, mid, hi, a);
    }
  }
  return a;
}
