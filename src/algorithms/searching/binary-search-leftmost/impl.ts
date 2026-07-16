// =============================================================================
// 最左二分（Leftmost Binary Search）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LeftmostHooks {
  /** 在 [lo,hi) 区间探测 mid，cmp 为 a[mid] 与 target 的关系。 */
  onProbe?: (lo: number, hi: number, mid: number, cmp: number) => void;
  /** 完成。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 最左二分：在升序（含重复）数组中找等于 target 的最左下标，不存在返回 -1。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function binarySearchLeftmost(
  arr: readonly number[],
  target: number,
  hooks: LeftmostHooks = {},
): number {
  const n = arr.length;
  let lo = 0;
  let hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const v = arr[mid]!;
    const cmp = v < target ? -1 : v > target ? 1 : 0;
    hooks.onProbe?.(lo, hi, mid, cmp);
    if (cmp < 0) lo = mid + 1;
    else hi = mid; // v >= target：潜在候选，向左继续
  }
  const found = lo < n && arr[lo] === target ? lo : -1;
  hooks.onDone?.(found);
  return found;
}
