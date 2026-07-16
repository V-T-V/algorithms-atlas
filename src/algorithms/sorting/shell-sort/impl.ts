// =============================================================================
// 希尔排序 Shell Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ShellSortHooks {
  /** 进入一个新 gap 轮：对每个 gap 做一次 gap-插入排序。 */
  onGap?: (gap: number) => void;
  /** 比较 gap-下标对 (i, j)，其中 j = i - gap。 */
  onCompare?: (i: number, j: number, gap: number) => void;
  /** 把 a[j] 右移到 a[j+gap]。 */
  onShift?: (from: number, to: number, gap: number) => void;
  /** 把 key 写入下标 i。 */
  onPlace?: (i: number, value: number) => void;
}

/** 生成希尔排序的 gap 序列：Knuth 序列 1, 4, 13, 40, ... （h = 3h+1）。 */
export function knuthGaps(n: number): number[] {
  const gaps: number[] = [];
  let h = 1;
  while (h < n) {
    gaps.push(h);
    h = 3 * h + 1;
  }
  // 从大到小返回
  return gaps.reverse();
}

/**
 * 希尔排序（原地、不稳定）。
 * 插入排序的推广：先按较大的 gap 把相距 gap 的元素分组做插入排序，
 * 再逐步缩小 gap 直到 1，使数组趋于有序，从而减少最终插入排序的移动次数。
 * 本实现采用 *Knuth gap 序列*（h = 3h+1）。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function shellSort(arr: readonly number[], hooks: ShellSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  for (const gap of knuthGaps(n)) {
    hooks.onGap?.(gap);
    // 对每个子序列做 gap-插入排序
    for (let i = gap; i < n; i++) {
      const key = a[i]!;
      let j = i - gap;
      while (j >= 0) {
        hooks.onCompare?.(i, j, gap);
        if (a[j]! > key) {
          a[j + gap] = a[j]!;
          hooks.onShift?.(j, j + gap, gap);
          j -= gap;
        } else {
          break;
        }
      }
      a[j + gap] = key;
      hooks.onPlace?.(j + gap, key);
    }
  }
  return a;
}
