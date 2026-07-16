// =============================================================================
// 滑动窗口中位数 · 纯算法实现
// 维护一个有序数组 sorted 表示当前窗口；滑动时二分插入新元素、二分删除旧元素。
// 中位数直接取 sorted 中间。O(n·k) 但实现绝对正确、可视清晰；
// 生产可用双堆 + 懒删除达到 O(n log k)，此处取舍以保证正确性。
// =============================================================================

/** 事件钩子。 */
export interface SWMedianHooks {
  /** 插入新元素（窗口右端 i）。给出插入后的有序窗口副本。 */
  onInsert?: (i: number, value: number, sorted: number[]) => void;
  /** 移除出窗元素（窗口左端 i-k）。给出移除后的有序窗口副本。 */
  onRemove?: (i: number, value: number, sorted: number[]) => void;
  /** 记录第 i 个窗口的中位数。 */
  onMedian?: (i: number, median: number, sorted: number[]) => void;
}

/** 升序二分插入位置。 */
function bisectInsert(arr: number[], v: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid]! < v) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** 升序数组中删除第一个等于 v 的元素。 */
function bisectRemove(arr: number[], v: number): void {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid]! < v) lo = mid + 1;
    else hi = mid;
  }
  // lo 是第一个 >= v 的位置；若等于 v 则删除
  if (lo < arr.length && arr[lo]! === v) arr.splice(lo, 1);
}

/**
 * 计算每个大小为 k 的滑动窗口的中位数。
 * @param arr 输入数组
 * @param k 窗口大小
 * @returns 每窗口中位数（k 偶取两中值平均）
 */
export function slidingWindowMedian(
  arr: readonly number[],
  k: number,
  hooks: SWMedianHooks = {},
): number[] {
  if (k <= 0) throw new RangeError('k must be positive');
  if (k > arr.length) throw new RangeError('k larger than array length');
  const result: number[] = [];
  const sorted: number[] = [];

  const median = (): number => {
    if (k % 2 === 1) {
      return sorted[(k - 1) >> 1]!;
    }
    return (sorted[k / 2 - 1]! + sorted[k / 2]!) / 2;
  };

  for (let i = 0; i < arr.length; i++) {
    // 入窗：二分插入
    const v = arr[i]!;
    const pos = bisectInsert(sorted, v);
    sorted.splice(pos, 0, v);
    hooks.onInsert?.(i, v, [...sorted]);
    // 出窗：二分删除
    if (i >= k) {
      const outVal = arr[i - k]!;
      bisectRemove(sorted, outVal);
      hooks.onRemove?.(i - k, outVal, [...sorted]);
    }
    // 窗口已满
    if (i >= k - 1) {
      const m = median();
      hooks.onMedian?.(i, m, [...sorted]);
      result.push(m);
    }
  }

  return result;
}
