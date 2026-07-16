// 冒泡排序（末次交换优化）· 纯算法实现
export interface BubbleLastSwapHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function bubbleSortLastSwap(
  arr: readonly number[],
  hooks: BubbleLastSwapHooks = {},
): number[] {
  const a = [...arr];
  let hi = a.length;
  while (hi > 1) {
    let lastSwap = 0;
    for (let i = 1; i < hi; i++) {
      hooks.onCompare?.(i - 1, i, a);
      if (a[i - 1]! > a[i]!) {
        [a[i - 1], a[i]] = [a[i]!, a[i - 1]!];
        lastSwap = i;
      }
    }
    hi = lastSwap;
  }
  return a;
}
