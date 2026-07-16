// 插入排序（哨兵优化）· 纯算法实现
export interface InsertSentinelHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function insertionSortSentinel(
  arr: readonly number[],
  hooks: InsertSentinelHooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;
  // 找最小值并放到首位做哨兵
  let minIdx = 0;
  for (let i = 1; i < n; i++) if (a[i]! < a[minIdx]!) minIdx = i;
  if (minIdx !== 0) [a[0], a[minIdx]] = [a[minIdx]!, a[0]!];
  for (let i = 2; i < n; i++) {
    const v = a[i]!;
    let j = i;
    while (a[j - 1]! > v) {
      hooks.onCompare?.(j - 1, j, a);
      a[j] = a[j - 1]!;
      j--;
    }
    a[j] = v;
  }
  return a;
}
