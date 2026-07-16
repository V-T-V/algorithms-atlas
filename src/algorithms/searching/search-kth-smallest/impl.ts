// 第 k 小元素（排序）· 纯算法实现
export interface KthHooks {
  onPick?: (value: number) => void;
}

export function kthSmallest(arr: readonly number[], k: number, hooks: KthHooks = {}): number {
  if (k < 1 || k > arr.length) throw new RangeError('k 超出范围');
  const sorted = [...arr].sort((a, b) => a - b);
  const v = sorted[k - 1]!;
  hooks.onPick?.(v);
  return v;
}
