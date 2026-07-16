// 快速选择（Hoare 双指针）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子向外暴露每一步操作。

/** 事件钩子。 */
export interface HoareSelectHooks {
  /** 进入 [lo, hi] 寻找第 k 小，本段 pivot 值为 pivotVal。 */
  onPartition?: (lo: number, hi: number, pivotVal: number) => void;
  /** 左右指针停在 i、j，正待比较。 */
  onScan?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 划分完成，返回划分点 p（左段右端）。 */
  onPinned?: (p: number) => void;
}

/**
 * Hoare 划分版快速选择：找数组中第 k 小（0-based）的元素值。
 * @param arr 待选数组（不修改原数组）
 * @param k 目标排名（0-based，0 = 最小）
 * @param hooks 可选事件钩子
 * @returns 第 k 小的元素值
 */
export function quickselectHoare(
  arr: readonly number[],
  k: number,
  hooks: HoareSelectHooks = {},
): number {
  const a = [...arr];
  if (k < 0 || k >= a.length) throw new RangeError(`k out of range: ${k}`);
  if (a.length === 0) throw new RangeError('empty array');

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  // Hoare 划分：返回 j（左段右端下标，满足 a[lo..j] <= pivot <= a[j+1..hi]）
  const partition = (lo: number, hi: number): number => {
    const pivotVal = a[Math.floor((lo + hi) / 2)]!; // 中点元素作基准值
    hooks.onPartition?.(lo, hi, pivotVal);
    let i = lo - 1;
    let j = hi + 1;
    while (true) {
      do {
        i++;
      } while (a[i]! < pivotVal);
      do {
        j--;
      } while (a[j]! > pivotVal);
      hooks.onScan?.(i, j);
      if (i >= j) {
        hooks.onPinned?.(j);
        return j;
      }
      swap(i, j);
      hooks.onSwap?.(i, j);
    }
  };

  const select = (lo: number, hi: number): number => {
    if (lo === hi) return a[lo]!;
    const p = partition(lo, hi);
    // 左段 [lo..p]，右段 [p+1..hi]
    if (k <= p) return select(lo, p);
    return select(p + 1, hi);
  };

  return select(0, a.length - 1);
}
