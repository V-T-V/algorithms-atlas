// =============================================================================
// 快速排序 Quick Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface QuickSortHooks {
  /** 进入某段 [lo, hi] 的划分。pivotIdx 为本次选中的基准下标。 */
  onPartition?: (lo: number, hi: number, pivotIdx: number) => void;
  /** 比较下标 i 与 pivot 值。 */
  onCompare?: (i: number, pivotIdx: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 下标 i 已就位（最终位置）。 */
  onPinned?: (i: number) => void;
}

/**
 * Lomuto 分区版快速排序（原地、不稳定）。
 * @param arr 待排序数组（会被原地修改；函数内克隆后操作以保证纯函数语义）
 * @param hooks 可选的事件钩子
 */
export function quickSort(arr: readonly number[], hooks: QuickSortHooks = {}): number[] {
  const a = [...arr];
  const pinned = new Set<number>();

  const partition = (lo: number, hi: number): number => {
    // Lomuto：取最右为基准
    const pivot = a[hi]!;
    let i = lo - 1; // i 指向「小于 pivot 区」的末尾
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
    // 把基准放到正确位置
    if (i + 1 !== hi) {
      swap(i + 1, hi);
      hooks.onSwap?.(i + 1, hi);
    }
    pinned.add(i + 1);
    hooks.onPinned?.(i + 1);
    return i + 1;
  };

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) {
      if (lo === hi) {
        pinned.add(lo);
        hooks.onPinned?.(lo);
      }
      return;
    }
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  };

  sort(0, a.length - 1);
  // 兜底：所有位置标记为已就位
  for (let k = 0; k < a.length; k++) pinned.add(k);
  return a;
}
