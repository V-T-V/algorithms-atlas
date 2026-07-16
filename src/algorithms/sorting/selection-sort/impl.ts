// =============================================================================
// 选择排序 Selection Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SelectionSortHooks {
  /** 开始第 round 轮（0-based），未排序段为 [round, n)。 */
  onRound?: (round: number, lo: number) => void;
  /** 当前候选最小值下标记为 minIdx。 */
  onMin?: (minIdx: number) => void;
  /** 比较下标 i 与当前 minIdx。 */
  onCompare?: (i: number, minIdx: number) => void;
  /** 交换下标 lo 与 minIdx（把本轮最小值就位）。 */
  onSwap?: (lo: number, minIdx: number) => void;
  /** 下标 lo 已就位（本轮最小值落点）。 */
  onPinned?: (lo: number) => void;
}

/**
 * 选择排序（原地、不稳定）。
 * 每轮在未排序段中选出最小值，与未排序段起点交换，使左侧有序段逐步增长。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function selectionSort(arr: readonly number[], hooks: SelectionSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  for (let lo = 0; lo < n - 1; lo++) {
    hooks.onRound?.(lo, lo);
    let minIdx = lo;
    hooks.onMin?.(minIdx);
    for (let i = lo + 1; i < n; i++) {
      hooks.onCompare?.(i, minIdx);
      if (a[i]! < a[minIdx]!) {
        minIdx = i;
        hooks.onMin?.(minIdx);
      }
    }
    if (minIdx !== lo) {
      swap(lo, minIdx);
      hooks.onSwap?.(lo, minIdx);
    }
    hooks.onPinned?.(lo);
  }
  if (n >= 1) hooks.onPinned?.(n - 1);
  return a;
}
