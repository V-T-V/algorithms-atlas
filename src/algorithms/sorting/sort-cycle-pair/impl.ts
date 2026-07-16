// 循环排序（成对循环）· 纯算法实现
export interface CyclePairHooks {
  onCycle?: (start: number, pos: number, arr: number[]) => void;
}

export function cycleSortPair(arr: readonly number[], hooks: CyclePairHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let start = 0; start < n - 1; start++) {
    let item = a[start]!;
    let pos = start;
    for (let i = start + 1; i < n; i++) if (a[i]! < item) pos++;
    if (pos === start) continue;
    while (item === a[pos]) pos++;
    [a[pos], item] = [item, a[pos]!];
    hooks.onCycle?.(start, pos, a);
    while (pos !== start) {
      pos = start;
      for (let i = start + 1; i < n; i++) if (a[i]! < item) pos++;
      while (item === a[pos]) pos++;
      if (item !== a[pos]) {
        [a[pos], item] = [item, a[pos]!];
        hooks.onCycle?.(start, pos, a);
      }
    }
  }
  return a;
}
