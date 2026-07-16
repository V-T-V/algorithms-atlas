// =============================================================================
// 查找第一个等于（Lower Bound）· 纯算法实现
// 在升序数组中找第一个等于 target 的下标（含重复元素）。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SearchFirstHooks {
  /** 在 [lo,hi] 区间探测中点 mid。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 区间收缩。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 找第一个等于 target 的下标；不存在返回 -1。
 */
export function searchFirst(
  arr: readonly number[],
  target: number,
  hooks: SearchFirstHooks = {},
): number {
  let lo = 0;
  let hi = arr.length - 1;
  let result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, hi, mid);
    const v = arr[mid]!;
    if (v === target) {
      result = mid; // 记录，继续向左找更早的
      hi = mid - 1;
      hooks.onShrink?.(lo, hi, 'left');
    } else if (v < target) {
      lo = mid + 1;
      hooks.onShrink?.(lo, hi, 'right');
    } else {
      hi = mid - 1;
      hooks.onShrink?.(lo, hi, 'left');
    }
  }
  hooks.onDone?.(result);
  return result;
}
