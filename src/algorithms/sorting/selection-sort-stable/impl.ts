// =============================================================================
// 稳定选择排序（Stable Selection Sort）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface StableSelectionHooks {
  /** 开始第 i 轮（i 为未排序段起点）。 */
  onRoundStart?: (i: number) => void;
  /** 在未排序段内比较下标 j 与当前最小值下标 minIdx。 */
  onCompare?: (j: number, minIdx: number) => void;
  /** 更新当前最小值下标为 minIdx。 */
  onNewMin?: (minIdx: number) => void;
  /** 把 a[minIdx] 插入到位置 i（区间 [i, minIdx) 整体右移一位）。 */
  onInsert?: (i: number, minIdx: number) => void;
  /** 下标 i 已就位。 */
  onSorted?: (i: number) => void;
}

/**
 * 稳定选择排序：每轮选出未排序段最小值，通过「插入式搬移」放到段首。
 * 中间元素整体右移一位，从而不跨越任何同值元素 → 稳定。
 * 时间 O(n²)，空间 O(1)，稳定。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function stableSelectionSort(
  arr: readonly number[],
  hooks: StableSelectionHooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    hooks.onRoundStart?.(i);
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      hooks.onCompare?.(j, minIdx);
      if (a[j]! < a[minIdx]!) {
        minIdx = j;
        hooks.onNewMin?.(minIdx);
      }
    }
    if (minIdx !== i) {
      // 把最小值取出，区间 [i, minIdx) 整体右移一位，再把最小值放到 i
      const minValue = a[minIdx]!;
      for (let k = minIdx; k > i; k--) {
        a[k] = a[k - 1]!;
      }
      a[i] = minValue;
      hooks.onInsert?.(i, minIdx);
    }
    hooks.onSorted?.(i);
  }
  if (n >= 1) hooks.onSorted?.(n - 1);
  return a;
}
