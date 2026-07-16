// =============================================================================
// 块归并排序 · 纯算法实现
// 分块（大小约 √n）+ 块内插入排序 + 块间用旋转原地归并。
// =============================================================================
export interface BlockMergeSortHooks {
  onBlockSize?: (size: number) => void;
  onBlockSorted?: (start: number, end: number, arr: number[]) => void;
  onBlocksMerged?: (start: number, end: number, arr: number[]) => void;
}

function reverse(a: number[], lo: number, hi: number): void {
  while (lo < hi) {
    [a[lo], a[hi]] = [a[hi]!, a[lo]!];
    lo++;
    hi--;
  }
}

function rotate(a: number[], lo: number, mid: number, hi: number): void {
  reverse(a, lo, mid - 1);
  reverse(a, mid, hi - 1);
  reverse(a, lo, hi - 1);
}

function insertSortRange(a: number[], lo: number, hi: number): void {
  for (let i = lo + 1; i < hi; i++) {
    const key = a[i]!;
    let j = i - 1;
    while (j >= lo && a[j]! > key) {
      a[j + 1] = a[j]!;
      j--;
    }
    a[j + 1] = key;
  }
}

/** 原地合并 a[lo..mid) 与 a[mid..hi)（右开）。 */
function mergeRanges(a: number[], lo: number, mid: number, hi: number): void {
  let i = lo;
  let j = mid;
  while (i < j && j < hi) {
    if (a[i]! <= a[j]!) {
      i++;
    } else {
      // 把 a[j] 插到位置 i：旋转 [i..j-1] 与 [j..j]
      rotate(a, i, j, j + 1);
      i++;
      j++;
      mid++;
    }
  }
}

export function blockMergeSort(arr: readonly number[], hooks: BlockMergeSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;
  const bs = Math.max(1, Math.floor(Math.sqrt(n)));
  hooks.onBlockSize?.(bs);

  // 1) 分块，每块插入排序
  for (let s = 0; s < n; s += bs) {
    const e = Math.min(s + bs, n);
    insertSortRange(a, s, e);
    hooks.onBlockSorted?.(s, e, a);
  }
  // 2) 块间归并：自底向上把相邻两块合并
  let size = bs;
  while (size < n) {
    for (let s = 0; s + size < n; s += 2 * size) {
      const mid = s + size;
      const hi = Math.min(s + 2 * size, n);
      mergeRanges(a, s, mid, hi);
      hooks.onBlocksMerged?.(s, hi, a);
    }
    size *= 2;
  }
  return a;
}
