// =============================================================================
// 慢排序 Slow Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SlowSortHooks {
  /** 递归处理前半 [lo, mid]，其中 mid = ⌊(lo+hi)/2⌋。 */
  onRecurse?: (lo: number, hi: number) => void;
  /** 找到 [lo, hi] 中的最大值（位于 maxIdx）并放到末尾 hi。 */
  onMaxPlaced?: (hi: number, maxIdx: number) => void;
}

/**
 * 慢排序（Slow Sort）。
 *
 * 原理：一种**故意低效**的分治算法（"multiply and surrender"）：
 * - 把 `[lo, hi]` 分成两半，递归排序前半与后半
 * - 取两半最大值的较大者，放到区间末尾 `hi`
 * - 再递归排序剩下的 `[lo, hi-1]`
 *
 * 它总是先把「最大值就位」之前的工作做完，但每一步都重新递归，导致极其低效。
 *
 * - 时间复杂度 `O(n^(log₂ n))`（超多项式），**不可用于实际**
 * - 空间 `O(n)`（递归栈）
 * - 稳定性：**不稳定**
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function slowSort(arr: readonly number[], hooks: SlowSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    hooks.onRecurse?.(lo, mid);
    sort(lo, mid);
    sort(mid + 1, hi);
    // 比较 a[mid] 与 a[hi]，把较大者放到 hi
    if (a[mid]! > a[hi]!) {
      const t = a[mid]!;
      a[mid] = a[hi]!;
      a[hi] = t;
    }
    hooks.onMaxPlaced?.(hi, a[mid]! > a[hi - 1]! && hi > lo ? mid : hi);
    sort(lo, hi - 1);
  };

  if (n > 0) sort(0, n - 1);
  return a;
}
