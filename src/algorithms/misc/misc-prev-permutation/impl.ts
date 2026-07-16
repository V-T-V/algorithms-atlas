// =============================================================================
// 上一个排列 · 纯算法实现
// =============================================================================

export interface PrevPermHooks {
  onSwap?: (i: number, j: number) => void;
  onReverse?: (lo: number, hi: number) => void;
}

/** 原地求上一个排列，返回是否还有上一个（false 表示已回绕到最大）。 */
export function prevPermutation(arr: number[], hooks: PrevPermHooks = {}): boolean {
  const n = arr.length;
  if (n < 2) return false;
  let i = n - 2;
  while (i >= 0 && arr[i]! <= arr[i + 1]!) i--;
  if (i < 0) {
    reverse(arr, 0, n - 1, hooks);
    return false;
  }
  let j = n - 1;
  while (arr[j]! >= arr[i]!) j--;
  [arr[i]!, arr[j]!] = [arr[j]!, arr[i]!];
  hooks.onSwap?.(i, j);
  reverse(arr, i + 1, n - 1, hooks);
  return true;
}

function reverse(arr: number[], lo: number, hi: number, hooks: PrevPermHooks): void {
  hooks.onReverse?.(lo, hi);
  while (lo < hi) {
    [arr[lo]!, arr[hi]!] = [arr[hi]!, arr[lo]!];
    lo++;
    hi--;
  }
}
