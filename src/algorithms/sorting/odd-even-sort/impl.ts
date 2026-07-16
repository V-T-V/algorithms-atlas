// =============================================================================
// 奇偶排序 Odd-Even Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface OddEvenSortHooks {
  /** 开始一轮遍历，phase 为 'odd'（奇数下标对）或 'even'（偶数下标对）。 */
  onPhase?: (phase: 'odd' | 'even', pass: number) => void;
  /** 比较下标 i、i+1 的元素。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
}

/**
 * 奇偶排序（砖排序）：交替比较所有奇数下标对与偶数下标对，直至有序。
 * 属于冒泡排序的变体，适合并行化。原地、稳定。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function oddEvenSort(arr: readonly number[], hooks: OddEvenSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  let sorted = false;
  let pass = 0;
  while (!sorted) {
    sorted = true;
    // 偶数阶段：比较 (0,1),(2,3),(4,5)...
    hooks.onPhase?.('even', pass);
    for (let i = 0; i + 1 < n; i += 2) {
      hooks.onCompare?.(i, i + 1);
      if (a[i]! > a[i + 1]!) {
        swap(a, i, i + 1);
        hooks.onSwap?.(i, i + 1);
        sorted = false;
      }
    }
    // 奇数阶段：比较 (1,2),(3,4),(5,6)...
    hooks.onPhase?.('odd', pass);
    for (let i = 1; i + 1 < n; i += 2) {
      hooks.onCompare?.(i, i + 1);
      if (a[i]! > a[i + 1]!) {
        swap(a, i, i + 1);
        hooks.onSwap?.(i, i + 1);
        sorted = false;
      }
    }
    pass++;
  }
  return a;
}

function swap(a: number[], i: number, j: number): void {
  const t = a[i]!;
  a[i] = a[j]!;
  a[j] = t;
}
