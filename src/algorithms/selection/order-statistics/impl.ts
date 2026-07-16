// =============================================================================
// 顺序统计量（Order Statistics）· 纯算法实现
// 求数组中第 k 小的元素（0-based）。采用快速选择（Quickselect）。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface OrderStatisticsHooks {
  /** 进入某段 [lo, hi] 的划分，pivotIdx 为本次选中的基准下标。 */
  onPartition?: (lo: number, hi: number, pivotIdx: number) => void;
  /** 比较下标 i 与 pivot 值。 */
  onCompare?: (i: number, pivotIdx: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 命中：下标 i 即为第 rank 小（0-based）。 */
  onPinned?: (i: number, rank: number) => void;
}

/**
 * 快速选择（Quickselect）：返回数组中第 k 小的元素（0-based）。
 *
 * - 每次取一个基准（这里取区间最右元素，Lomuto 分区），把区间分为
 *   「小于基准」与「大于等于基准」两部分，基准落到最终位置 p。
 * - 若 p === k，命中返回；若 k < p，只在左半递归；若 k > p，只在右半递归。
 * - 期望时间 `O(n)`，最坏 `O(n²)`（可用中位数的中位数优化，见 median-of-medians）。
 *
 * @param arr 输入数组（克隆后操作，不改原数组）
 * @param k 目标排名，0-based；须在 [0, arr.length-1] 内
 * @param hooks 可选事件钩子
 * @returns 第 k 小的元素值
 */
export function quickselect(
  arr: readonly number[],
  k: number,
  hooks: OrderStatisticsHooks = {},
): number {
  const a = [...arr];
  const n = a.length;
  if (!Number.isInteger(k) || k < 0 || k >= n) {
    throw new RangeError(`k 须在 [0, ${n - 1}]，收到 ${k}`);
  }

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const partition = (lo: number, hi: number): number => {
    const pivot = a[hi]!;
    let i = lo - 1;
    hooks.onPartition?.(lo, hi, hi);
    for (let j = lo; j < hi; j++) {
      hooks.onCompare?.(j, hi);
      if (a[j]! < pivot) {
        i++;
        if (i !== j) {
          swap(i, j);
          hooks.onSwap?.(i, j);
        }
      }
    }
    if (i + 1 !== hi) {
      swap(i + 1, hi);
      hooks.onSwap?.(i + 1, hi);
    }
    return i + 1;
  };

  const select = (lo: number, hi: number): number => {
    if (lo === hi) {
      hooks.onPinned?.(lo, lo);
      return a[lo]!;
    }
    const p = partition(lo, hi);
    if (p === k) {
      hooks.onPinned?.(p, k);
      return a[p]!;
    } else if (k < p) {
      return select(lo, p - 1);
    } else {
      return select(p + 1, hi);
    }
  };

  return select(0, n - 1);
}

/** 对应的别名：orderStatistics 等价于 quickselect。 */
export function orderStatistics(
  arr: readonly number[],
  k: number,
  hooks: OrderStatisticsHooks = {},
): number {
  return quickselect(arr, k, hooks);
}
