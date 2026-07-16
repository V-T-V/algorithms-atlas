// 侏儒排序（朴素）· 纯算法实现
export interface GnomeNaiveHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function gnomeSortNaive(arr: readonly number[], hooks: GnomeNaiveHooks = {}): number[] {
  const a = [...arr];
  let i = 1;
  while (i < a.length) {
    hooks.onCompare?.(i - 1, i, a);
    if (i === 0 || a[i - 1]! <= a[i]!) i++;
    else {
      [a[i - 1], a[i]] = [a[i]!, a[i - 1]!];
      i--;
    }
  }
  return a;
}
