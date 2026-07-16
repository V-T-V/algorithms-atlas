// =============================================================================
// 插入排序 Insertion Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface InsertionSortHooks {
  /** 进入新一轮插入，外层下标 i（1-based 起步，意为「待插入元素」）。 */
  onPick?: (i: number) => void;
  /** 比较 key 与下标 j 的元素（j 为已排序段中被考察的位置）。 */
  onCompare?: (j: number, keyIdx: number) => void;
  /** 把下标 j 的元素向右平移到 j+1。 */
  onShift?: (j: number, jNext: number) => void;
  /** 把待插入元素写入下标 i（其最终落点），value 为写入值。 */
  onPlace?: (i: number, value: number) => void;
}

/**
 * 插入排序（原地、稳定）。
 * 维护一个左侧有序段；依次把右侧每个元素向左插入到正确位置。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function insertionSort(arr: readonly number[], hooks: InsertionSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  for (let i = 1; i < n; i++) {
    hooks.onPick?.(i);
    const key = a[i]!;
    let j = i - 1;
    // 把大于 key 的元素整体右移
    while (j >= 0) {
      hooks.onCompare?.(j, i);
      if (a[j]! > key) {
        a[j + 1] = a[j]!;
        hooks.onShift?.(j, j + 1);
        j--;
      } else {
        break;
      }
    }
    a[j + 1] = key;
    hooks.onPlace?.(j + 1, key);
  }
  return a;
}
