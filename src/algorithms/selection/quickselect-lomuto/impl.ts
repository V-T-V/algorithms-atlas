// 快速选择（Lomuto 分区）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子向外暴露每一步操作。

/** 事件钩子。 */
export interface QuickSelectHooks {
  /** 进入某段 [lo, hi] 寻找第 k 小。pivotIdx 为本次选中的基准下标。 */
  onPartition?: (lo: number, hi: number, pivotIdx: number) => void;
  /** 比较下标 i 与 pivot 值。 */
  onCompare?: (i: number, pivotIdx: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 基准就位 p。 */
  onPinned?: (p: number) => void;
}

/**
 * Lomuto 分区版快速选择：找数组中第 k 小（0-based）的元素值。
 * @param arr 待选数组（不修改原数组）
 * @param k 目标排名（0-based，0 = 最小）
 * @param hooks 可选事件钩子
 * @returns 第 k 小的元素值
 */
export function quickselectLomuto(
  arr: readonly number[],
  k: number,
  hooks: QuickSelectHooks = {},
): number {
  const a = [...arr];
  if (k < 0 || k >= a.length) throw new RangeError(`k out of range: ${k}`);

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const select = (lo: number, hi: number): number => {
    if (lo === hi) return a[lo]!;
    // Lomuto 分区
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
