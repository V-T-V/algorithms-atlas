// Top-K 快速选择 · 实现

export interface TkqHooks {
  onPivot?: (pivot: number) => void;
  onPartition?: (left: number, right: number) => void;
}

/** quickselect：把第 kOrder 小（0-based）放到位置 kOrder。原地修改 arr。 */
export function quickselect(arr: number[], kOrder: number, hooks: TkqHooks = {}): void {
  const partition = (lo: number, hi: number): number => {
    const pivot = arr[hi]!;
    hooks.onPivot?.(pivot);
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (arr[j]! < pivot) {
        [arr[i], arr[j]] = [arr[j]!, arr[i]!];
        i++;
      }
    }
    [arr[i], arr[hi]] = [arr[hi]!, arr[i]!];
    hooks.onPartition?.(lo, hi);
    return i;
  };

  const rec = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    if (p === kOrder) return;
    if (kOrder < p) rec(lo, p - 1);
    else rec(p + 1, hi);
  };

  rec(0, arr.length - 1);
}

/** 返回前 k 大（无序），不改原数组。 */
export function topKQuick(input: readonly number[], k: number, hooks: TkqHooks = {}): number[] {
  if (k <= 0) return [];
  const arr = [...input];
  const order = arr.length - k; // 第 (n-k) 小
  if (order < 0) return arr;
  quickselect(arr, order, hooks);
  return arr.slice(order);
}
