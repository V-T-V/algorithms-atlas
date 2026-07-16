// =============================================================================
// 原地归并排序 · 纯算法实现
// 手摇算法（三次反转）实现 O(1) 空间原地合并。
// =============================================================================
export interface InplaceMergeSortHooks {
  onMerge?: (lo: number, mid: number, hi: number, arr: number[]) => void;
  onRotate?: (lo: number, mid: number, hi: number, arr: number[]) => void;
}

function reverse(a: number[], lo: number, hi: number): void {
  while (lo < hi) {
    [a[lo], a[hi]] = [a[hi]!, a[lo]!];
    lo++;
    hi--;
  }
}

/** 把 [lo,mid) 与 [mid,hi) 两个区间旋转（整体交换位置），用三次反转实现。 */
function rotate(a: number[], lo: number, mid: number, hi: number): void {
  // hi 为右开边界
  reverse(a, lo, mid - 1);
  reverse(a, mid, hi - 1);
  reverse(a, lo, hi - 1);
}

/**
 * 原地合并 a[lo..mid] 与 a[mid+1..hi]（含端点）。
 * 用经典「手摇」法：找到左段中第一个 > 右段首的位置，再找右段中第一个 >= 该左段值的位置，旋转。
 */
function inplaceMerge(
  a: number[],
  lo: number,
  mid: number,
  hi: number,
  hooks: InplaceMergeSortHooks,
): void {
  let i = lo;
  let m = mid;
  while (i <= m && m < hi) {
    if (a[i]! <= a[m + 1]!) {
      i++;
    } else {
      // 找右段 [m+1..hi] 中第一个 >= a[i] 的位置 j，把 [i..m] 与 [m+1..j-1] 旋转
      let j = m + 2;
      while (j <= hi && a[j]! < a[i]!) j++;
      rotate(a, i, m + 1, j); // 旋转 [i..m] 与 [m+1..j-1]
      hooks.onRotate?.(i, m + 1, j, a);
      const shifted = j - (m + 1);
      i += shifted;
      m += shifted;
    }
  }
  hooks.onMerge?.(lo, mid, hi, a);
}

export function inplaceMergeSort(
  arr: readonly number[],
  hooks: InplaceMergeSortHooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;
  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    sort(lo, mid);
    sort(mid + 1, hi);
    inplaceMerge(a, lo, mid, hi, hooks);
  };
  sort(0, n - 1);
  return a;
}
