// =============================================================================
// 滑动窗口去重计数 · 纯算法实现
// 用 freq Map 维护窗口内每个值的出现次数；distinct 计数随增减而更新。
// =============================================================================

export interface SWDistinctHooks {
  onAdd?: (i: number, value: number, distinct: number, freq: Map<number, number>) => void;
  onRemove?: (i: number, value: number, distinct: number, freq: Map<number, number>) => void;
  onWindow?: (endIndex: number, distinct: number, freq: Map<number, number>) => void;
}

/**
 * 计算每个大小为 k 的滑动窗口中不同元素的个数。
 * @param arr 输入数组（元素可为任意整数）
 * @param k 窗口大小
 * @returns 每窗口不同元素个数数组
 */
export function slidingWindowDistinct(
  arr: readonly number[],
  k: number,
  hooks: SWDistinctHooks = {},
): number[] {
  if (k <= 0) throw new RangeError('k must be positive');
  if (k > arr.length) throw new RangeError('k larger than array length');
  const n = arr.length;
  const freq = new Map<number, number>();
  let distinct = 0;
  const result: number[] = [];

  for (let i = 0; i < n; i++) {
    // 入窗
    const v = arr[i]!;
    const before = freq.get(v) ?? 0;
    if (before === 0) distinct++;
    freq.set(v, before + 1);
    hooks.onAdd?.(i, v, distinct, new Map(freq));
    // 出窗
    if (i >= k) {
      const u = arr[i - k]!;
      const ub = freq.get(u) ?? 0;
      if (ub <= 1) {
        freq.delete(u);
        distinct--;
      } else {
        freq.set(u, ub - 1);
      }
      hooks.onRemove?.(i - k, u, distinct, new Map(freq));
    }
    // 窗口已满
    if (i >= k - 1) {
      hooks.onWindow?.(i, distinct, new Map(freq));
      result.push(distinct);
    }
  }

  return result;
}
