// =============================================================================
// 中位数的中位数 Median of Medians · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 这是 BFPRT 选择算法：用「中位数的中位数」做基准，保证最坏 O(n)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MedianOfMediansHooks {
  /** 选中基准值（由中位数的中位数策略得出）。 */
  onPivotChosen?: (lo: number, hi: number, pivotValue: number) => void;
  /** 进入某段 [lo, hi] 的划分，pivotIdx 为基准所在下标。 */
  onPartition?: (lo: number, hi: number, pivotIdx: number) => void;
  /** 比较下标 i 与基准值。 */
  onCompare?: (i: number, pivotIdx: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 下标 i 已确定为第 rank 小（命中目标），算法结束。 */
  onPinned?: (i: number, rank: number) => void;
}

/** 对不超过 5 个元素的小数组，返回其中位数（偶数个取靠左的中间值）。 */
function medianOfSmall(arr: readonly number[]): number {
  const s = [...arr].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)]!;
}

/**
 * 「中位数的中位数」：返回给定数组的一个良好基准值。
 * 把元素每 5 个一组，取各组中位数，再递归取这些中位数的中位数。
 * 该基准保证在主数组中两侧元素各至少占 3/10，使选择算法最坏仍为 `O(n)`。
 */
function medianOfMediansValue(values: readonly number[]): number {
  if (values.length <= 5) return medianOfSmall(values);
  const medians: number[] = [];
  for (let i = 0; i < values.length; i += 5) {
    medians.push(medianOfSmall(values.slice(i, i + 5)));
  }
  return medianOfMediansValue(medians);
}

/**
 * 中位数的中位数选择（BFPRT）：返回数组中第 k 小的元素（0-based）。
 * 与快速选择不同，它用「中位数的中位数」选基准，保证**最坏情况 O(n)**。
 * @param arr 输入数组（克隆后操作，不改原数组）
 * @param k 目标排名，0-based；须在 [0, arr.length-1] 内
 * @param hooks 可选的事件钩子
 * @returns 第 k 小的元素值
 */
export function medianOfMedians(
  arr: readonly number[],
  k: number,
  hooks: MedianOfMediansHooks = {},
): number {
  const a = [...arr];
  const n = a.length;

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const partition = (lo: number, hi: number): number => {
    // Lomuto 分区，基准当前位于 hi
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
      hooks.onPinned?.(lo, k);
      return a[lo]!;
    }
    // 1) 用「中位数的中位数」选出基准值
    const pivotValue = medianOfMediansValue(a.slice(lo, hi + 1));
    hooks.onPivotChosen?.(lo, hi, pivotValue);
    // 2) 在 [lo,hi] 中定位该基准值的下标
    let pivotIdx = lo;
    while (pivotIdx <= hi && a[pivotIdx]! !== pivotValue) pivotIdx++;
    // 3) 把基准换到区间末尾，再做 Lomuto 分区
    if (pivotIdx !== hi) {
      swap(pivotIdx, hi);
      hooks.onSwap?.(pivotIdx, hi);
    }
    const p = partition(lo, hi);
    // 4) 只递归包含目标排名 k 的那一侧
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
