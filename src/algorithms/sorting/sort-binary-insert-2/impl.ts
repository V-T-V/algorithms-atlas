// 二分插入排序 · 纯算法实现
export interface BinInsert2Hooks {
  onInsert?: (pos: number, value: number, arr: number[]) => void;
}

export function binaryInsertionSort2(
  arr: readonly number[],
  hooks: BinInsert2Hooks = {},
): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const v = a[i]!;
    let lo = 0,
      hi = i;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (a[mid]! < v) lo = mid + 1;
      else hi = mid;
    }
    const pos = lo;
    for (let j = i; j > pos; j--) a[j] = a[j - 1]!;
    a[pos] = v;
    hooks.onInsert?.(pos, v, a);
  }
  return a;
}
