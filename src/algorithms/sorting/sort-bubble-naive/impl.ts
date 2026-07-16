// 冒泡排序（朴素）· 纯算法实现
export interface BubbleNaiveHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function bubbleSortNaive(arr: readonly number[], hooks: BubbleNaiveHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      hooks.onCompare?.(j, j + 1, a);
      if (a[j]! > a[j + 1]!) [a[j], a[j + 1]] = [a[j + 1]!, a[j]!];
    }
  }
  return a;
}
