// =============================================================================
// 归并排序 Merge Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MergeSortHooks {
  /** 将区间 [lo, hi] 一分为二（mid 为左段右端）。叶子区间不触发。 */
  onSplit?: (lo: number, mid: number, hi: number) => void;
  /** 准备合并两段有序子区间 [lo,mid] 与 [mid+1,hi]。 */
  onMergeStart?: (lo: number, mid: number, hi: number) => void;
  /** 合并过程中比较左指针 i 与右指针 j 处的元素。 */
  onCompare?: (i: number, j: number) => void;
  /** 把值写入目的下标 dest（写回主数组）。 */
  onWrite?: (dest: number, value: number) => void;
}

/**
 * 归并排序（自顶向下、稳定、非原地）。
 * 递归地把数组对半切，再逐层把有序的两段合并。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function mergeSort(arr: readonly number[], hooks: MergeSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;

  const merge = (lo: number, mid: number, hi: number): void => {
    hooks.onMergeStart?.(lo, mid, hi);
    // 复制两段到临时数组
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0; // left 指针
    let j = 0; // right 指针
    let k = lo; // 写回主数组的位置
    while (i < left.length && j < right.length) {
      hooks.onCompare?.(lo + i, mid + 1 + j);
      // <= 保证稳定性：相等时取左段
      if (left[i]! <= right[j]!) {
        a[k] = left[i]!;
        hooks.onWrite?.(k, left[i]!);
        i++;
      } else {
        a[k] = right[j]!;
        hooks.onWrite?.(k, right[j]!);
        j++;
      }
      k++;
    }
    while (i < left.length) {
      a[k] = left[i]!;
      hooks.onWrite?.(k, left[i]!);
      i++;
      k++;
    }
    while (j < right.length) {
      a[k] = right[j]!;
      hooks.onWrite?.(k, right[j]!);
      j++;
      k++;
    }
  };

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    hooks.onSplit?.(lo, mid, hi);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  };

  sort(0, n - 1);
  return a;
}
