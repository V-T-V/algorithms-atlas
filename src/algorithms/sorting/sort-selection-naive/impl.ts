// 选择排序（朴素）· 纯算法实现
export interface SelectionNaiveHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function selectionSortNaive(
  arr: readonly number[],
  hooks: SelectionNaiveHooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let mi = i;
    for (let j = i + 1; j < n; j++) {
      hooks.onCompare?.(j, mi, a);
      if (a[j]! < a[mi]!) mi = j;
    }
    if (mi !== i) [a[i], a[mi]] = [a[mi]!, a[i]!];
  }
  return a;
}
