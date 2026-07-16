// 希尔排序（Ciura 间隔）· 纯算法实现
export interface ShellCiuraHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

const CIURA_GAPS = [1, 4, 10, 23, 57, 132, 301, 701, 1750, 3937];

export function shellSortCiura(arr: readonly number[], hooks: ShellCiuraHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  const gaps: number[] = [];
  for (let k = CIURA_GAPS.length - 1; k >= 0; k--)
    if (CIURA_GAPS[k]! < n) gaps.push(CIURA_GAPS[k]!);
  for (const gap of gaps) {
    for (let i = gap; i < n; i++) {
      const v = a[i]!;
      let j = i;
      while (j >= gap && a[j - gap]! > v) {
        hooks.onCompare?.(j - gap, j, a);
        a[j] = a[j - gap]!;
        j -= gap;
      }
      a[j] = v;
    }
  }
  return a;
}
