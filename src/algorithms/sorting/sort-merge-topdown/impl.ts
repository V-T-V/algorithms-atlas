// 归并排序（自顶向下）· 纯算法实现
export interface MergeTopDownHooks {
  onMerge?: (lo: number, mid: number, hi: number, arr: number[]) => void;
}

function msort(a: number[], aux: number[], lo: number, hi: number, hooks: MergeTopDownHooks): void {
  if (lo >= hi) return;
  const mid = (lo + hi) >>> 1;
  msort(a, aux, lo, mid, hooks);
  msort(a, aux, mid + 1, hi, hooks);
  for (let k = lo; k <= hi; k++) aux[k] = a[k]!;
  let i = lo,
    j = mid + 1,
    k = lo;
  while (i <= mid && j <= hi) a[k++] = aux[i]! <= aux[j]! ? aux[i++]! : aux[j++]!;
  while (i <= mid) a[k++] = aux[i++]!;
  while (j <= hi) a[k++] = aux[j++]!;
  hooks.onMerge?.(lo, mid, hi, a);
}

export function mergeSortTopDown(arr: readonly number[], hooks: MergeTopDownHooks = {}): number[] {
  const a = [...arr];
  if (a.length <= 1) return a;
  const aux = new Array<number>(a.length);
  msort(a, aux, 0, a.length - 1, hooks);
  return a;
}
