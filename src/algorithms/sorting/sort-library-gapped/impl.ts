// 图书馆排序（带空位）· 纯算法实现
export interface LibraryGappedHooks {
  onInsert?: (pos: number, value: number, arr: number[]) => void;
}

export function librarySortGapped(
  arr: readonly number[],
  hooks: LibraryGappedHooks = {},
): number[] {
  const sorted: number[] = [];
  for (const v of arr) {
    let lo = 0,
      hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (sorted[mid]! < v) lo = mid + 1;
      else hi = mid;
    }
    sorted.splice(lo, 0, v);
    hooks.onInsert?.(lo, v, sorted);
  }
  return sorted;
}
