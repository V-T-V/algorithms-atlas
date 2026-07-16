// =============================================================================
// Stooge 排序 Stooge Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface StoogeSortHooks {
  /** 比较区间两端 a[lo] 与 a[hi]。 */
  onCompare?: (lo: number, hi: number) => void;
  /** 交换区间两端（a[lo] > a[hi] 时）。 */
  onSwap?: (lo: number, hi: number) => void;
}

/**
 * Stooge 排序（Stooge Sort）。
 *
 * 原理：一种**故意低效**的递归排序（命名自「三个臭皮匠」The Three Stooges）。
 * 对区间 `[lo, hi]`：
 * 1. 若 `a[lo] > a[hi]`，交换两端
 * 2. 若区间长度 `≥ 3`，取 `t = ⌊(hi - lo + 1)/3⌋`：
 *    - 递归排序前 2/3：`[lo, hi - t]`
 *    - 递归排序后 2/3：`[lo + t, hi]`
 *    - 再递归排序前 2/3：`[lo, hi - t]`
 *
 * - 时间复杂度 `O(n^(log 3 / log 1.5)) ≈ O(n^2.7095)`，**不可用于实际**
 * - 空间 `O(n)`（递归栈）
 * - 稳定性：**不稳定**
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function stoogeSort(arr: readonly number[], hooks: StoogeSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    hooks.onCompare?.(lo, hi);
    if (a[lo]! > a[hi]!) {
      const t = a[lo]!;
      a[lo] = a[hi]!;
      a[hi] = t;
      hooks.onSwap?.(lo, hi);
    }
    if (hi - lo + 1 >= 3) {
      const t = Math.floor((hi - lo + 1) / 3);
      sort(lo, hi - t); // 前 2/3
      sort(lo + t, hi); // 后 2/3
      sort(lo, hi - t); // 再次前 2/3
    }
  };

  if (n > 0) sort(0, n - 1);
  return a;
}
