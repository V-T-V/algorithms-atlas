// =============================================================================
// 指数搜索 Exponential Search · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ExponentialSearchHooks {
  /** 倍增探测：当前 bound 越界或 a[min(bound,n)-1] >= target 时停止。 */
  onBound?: (bound: number) => void;
  /** 倍增阶段结束，定位到二分区间 [lo, hi]。 */
  onRange?: (lo: number, hi: number) => void;
  /** 二分阶段每次取中点比较。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 查找结束：命中下标或 -1。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 指数搜索（也称 galloping / doubling search）：在**升序**数组中查找 target，
 * 返回其下标；不存在返回 -1。
 *
 * - 倍增阶段：`bound` 从 1 起，每次 `bound *= 2`，直到越界或
 *   `a[min(bound, n) - 1] >= target`；起点为 `prev = floor(bound/2)`
 * - 二分阶段：在 `[prev, min(bound, n) - 1]` 内二分查找
 *
 * 先特判 `a[0] === target`（bound 从 1 起，避免漏查首元素）。
 *
 * - 时间：`O(log n)`（倍增 `O(log k)` + 二分 `O(log k)`，k 为命中位置）
 * - 空间：`O(1)`（迭代二分）
 * - 适合**无界/极长**或**目标偏小**的有序序列（如流式、磁盘）
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function exponentialSearch(
  arr: readonly number[],
  target: number,
  hooks: ExponentialSearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  // 特判首元素
  if (arr[0]! === target) {
    hooks.onRange?.(0, 0);
    hooks.onProbe?.(0, 0, 0);
    hooks.onDone?.(0);
    return 0;
  }

  // 倍增找区间
  let bound = 1;
  while (bound < n && arr[Math.min(bound, n) - 1]! < target) {
    hooks.onBound?.(bound);
    bound *= 2;
  }
  hooks.onBound?.(Math.min(bound, n));

  const lo = Math.floor(bound / 2);
  const hi = Math.min(bound, n) - 1;
  hooks.onRange?.(lo, hi);

  // 二分 [lo, hi]
  let l = lo;
  let h = hi;
  while (l <= h) {
    const mid = (l + h) >> 1;
    hooks.onProbe?.(l, h, mid);
    const v = arr[mid]!;
    if (v === target) {
      hooks.onDone?.(mid);
      return mid;
    }
    if (v < target) l = mid + 1;
    else h = mid - 1;
  }

  hooks.onDone?.(-1);
  return -1;
}
