// 快速排序（三路划分）· 纯算法实现
export interface Quick3WayHooks {
  onPivot?: (idx: number, arr: number[]) => void;
  onPartition?: (lt: number, gt: number, arr: number[]) => void;
}

function sort3(a: number[], lo: number, hi: number, hooks: Quick3WayHooks): void {
  if (lo >= hi) return;
  const pivot = a[lo]!;
  hooks.onPivot?.(lo, a);
  let lt = lo,
    gt = hi,
    i = lo + 1;
  while (i <= gt) {
    if (a[i]! < pivot) {
      [a[lt], a[i]] = [a[i]!, a[lt]!];
      lt++;
      i++;
    } else if (a[i]! > pivot) {
      [a[i], a[gt]] = [a[gt]!, a[i]!];
      gt--;
    } else i++;
  }
  hooks.onPartition?.(lt, gt, a);
  sort3(a, lo, lt - 1, hooks);
  sort3(a, gt + 1, hi, hooks);
}

export function quickSort3Way(arr: readonly number[], hooks: Quick3WayHooks = {}): number[] {
  const a = [...arr];
  sort3(a, 0, a.length - 1, hooks);
  return a;
}
