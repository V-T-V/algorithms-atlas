// 插入排序（链表式）· 纯算法实现
export interface InsertLinkedHooks {
  onShift?: (i: number, value: number, arr: number[]) => void;
}

export function insertionSortLinked(
  arr: readonly number[],
  hooks: InsertLinkedHooks = {},
): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const v = a[i]!;
    let j = i;
    while (j > 0 && a[j - 1]! > v) {
      hooks.onShift?.(j, v, a);
      a[j] = a[j - 1]!;
      j--;
    }
    a[j] = v;
  }
  return a;
}
