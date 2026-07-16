// 快速选择（三数取中基准）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子暴露每一步。

/** 事件钩子。 */
export interface QuickSelectMedian3Hooks {
  /** 三数取中后，确定基准值（给出 lo/mid/hi 三处值与选中的中位数）。 */
  onPivotChoice?: (lo: number, mid: number, hi: number, pivot: number) => void;
  /** 进入分区 [lo, hi]。pivotIdx 为本次基准最终所在 hi。 */
  onPartition?: (lo: number, hi: number) => void;
  /** 比较下标 i 与基准。 */
  onCompare?: (i: number, pivotIdx: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 基准就位 p。 */
  onPinned?: (p: number) => void;
}

/**
 * 三数取中版快速选择：找数组中第 k 小（0-based）。
 * @param arr 待选数组（不修改原数组）
 * @param k 目标排名（0-based，0 = 最小）
 * @param hooks 可选事件钩子
 * @returns 第 k 小的元素值
 */
export function quickselectMedian3(
  arr: readonly number[],
  k: number,
  hooks: QuickSelectMedian3Hooks = {},
): number {
  const a = [...arr];
  if (k < 0 || k >= a.length) throw new RangeError(`k out of range: ${k}`);

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const median3 = (lo: number, hi: number): void => {
    const mid = (lo + hi) >> 1;
    // 排序三个位置使 a[lo] <= a[mid] <= a[hi]
    if (a[lo]! > a[mid]!) {
      swap(lo, mid);
      hooks.onSwap?.(lo, mid);
    }
    if (a[lo]! > a[hi]!) {
      swap(lo, hi);
      hooks.onSwap?.(lo, hi);
    }
    if (a[mid]! > a[hi]!) {
      swap(mid, hi);
      hooks.onSwap?.(mid, hi);
    }
    // 此时 a[mid] 为中位数，交换到 hi 作为基准
    if (mid !== hi) {
      swap(mid, hi);
      hooks.onSwap?.(mid, hi);
    }
    hooks.onPivotChoice?.(lo, mid, hi, a[hi]!);
  };

  const select = (lo: number, hi: number): number => {
    if (lo === hi) return a[lo]!;
    median3(lo, hi);
    hooks.onPartition?.(lo, hi);
    const pivot = a[hi]!;
    let i = lo - 1;
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
    const p = i + 1;
    if (p !== hi) {
      swap(p, hi);
      hooks.onSwap?.(p, hi);
    }
    hooks.onPinned?.(p);
    if (k === p) return a[k]!;
    if (k < p) return select(lo, p - 1);
    return select(p + 1, hi);
  };

  return select(0, a.length - 1);
}
