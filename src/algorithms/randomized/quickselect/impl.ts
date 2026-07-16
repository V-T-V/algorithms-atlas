// =============================================================================
// 快速选择 Quickselect · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface QuickselectHooks {
  /** 进入某段 [lo, hi] 的划分，目标排名为 rank（0-based）。pivotIdx 为选中的基准下标。 */
  onPartition?: (lo: number, hi: number, rank: number, pivotIdx: number) => void;
  /** 比较下标 i 与基准值。 */
  onCompare?: (i: number, pivotIdx: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 下标 i 已确定为第 rank 小（命中目标），算法结束。 */
  onPinned?: (i: number, rank: number) => void;
}

/**
 * 快速选择：返回数组中第 k 小的元素（0-based，k=0 即最小值）。
 * 基于 Lomuto 分区（取最右元素为基准）。只递归包含目标排名的那一侧，
 * 因此平均比完整排序更快。本实现为确定性版本；通常可改为随机选基准以获得期望 `O(n)`。
 * @param arr 输入数组（克隆后操作，不改原数组）
 * @param k 目标排名，0-based；须在 [0, arr.length-1] 内
 * @param hooks 可选的事件钩子
 * @returns 第 k 小的元素值
 */
export function quickselect(
  arr: readonly number[],
  k: number,
  hooks: QuickselectHooks = {},
): number {
  const a = [...arr];
  const n = a.length;

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const partition = (lo: number, hi: number): number => {
    const pivot = a[hi]!;
    let i = lo - 1;
    hooks.onPartition?.(lo, hi, k, hi);
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
