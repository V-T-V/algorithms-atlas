// 归并排序（原地简化）· 纯算法实现
export interface MergeInplace2Hooks {
  onMerge?: (lo: number, mid: number, hi: number, arr: number[]) => void;
}

function reverse(a: number[], lo: number, hi: number): void {
  while (lo < hi) {
    [a[lo], a[hi]] = [a[hi]!, a[lo]!];
    lo++;
    hi--;
  }
}

function mergeInplace(
  a: number[],
  lo: number,
  mid: number,
  hi: number,
  hooks: MergeInplace2Hooks,
): void {
  let i = lo,
    j = mid;
  while (i < j && j <= hi) {
    if (a[i]! <= a[j]!) i++;
    else {
      // 把 a[j] 插到 i 位置：旋转 [i, j]
      const v = a[j]!;
      let k = j;
      while (k > i) {
        a[k] = a[k - 1]!;
        k--;
      }
      a[i] = v;
      i++;
      j++;
      mid++;
    }
  }
  hooks.onMerge?.(lo, mid, hi, a);
}

function msort(a: number[], lo: number, hi: number, hooks: MergeInplace2Hooks): void {
  if (lo >= hi) return;
  const mid = (lo + hi) >>> 1;
  msort(a, lo, mid, hooks);
  msort(a, mid + 1, hi, hooks);
  mergeInplace(a, lo, mid + 1, hi, hooks);
}

export function mergeSortInplace2(
  arr: readonly number[],
  hooks: MergeInplace2Hooks = {},
): number[] {
  const a = [...arr];
  if (a.length > 1) msort(a, 0, a.length - 1, hooks);
  void reverse;
  return a;
}
