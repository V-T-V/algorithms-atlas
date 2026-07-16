// 递归数组求和 · 纯算法实现
export interface RecSumHooks {
  onRecurse?: (head: number, tailSum: number, total: number) => void;
  onResult?: (total: number) => void;
}

export function recSum(arr: readonly number[], hooks: RecSumHooks = {}): number {
  if (arr.length === 0) return 0;
  const head = arr[0]!;
  const tailSum = recSum(arr.slice(1), hooks);
  const total = head + tailSum;
  hooks.onRecurse?.(head, tailSum, total);
  return total;
}

/** 范围版（避免切片拷贝）。 */
export function recSumRange(arr: readonly number[], lo = 0, hi = arr.length - 1): number {
  if (lo > hi) return 0;
  if (lo === hi) return arr[lo]!;
  const mid = (lo + hi) >> 1;
  return recSumRange(arr, lo, mid) + recSumRange(arr, mid + 1, hi);
}
