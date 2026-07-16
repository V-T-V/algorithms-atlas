// =============================================================================
// 查找插入位置（Search Insert Position）· 纯算法实现
// 在升序数组中找 target 应插入的位置（即 lower bound）。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SearchInsertHooks {
  /** 在 [lo,hi] 区间探测中点 mid。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 区间收缩。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成。 */
  onDone?: (insertPos: number) => void;
}

/**
 * 找 target 应插入的位置：首个 >= target 的下标（lower bound）。
 * 若已存在则等于其下标。
 */
export function searchInsert(
  arr: readonly number[],
  target: number,
  hooks: SearchInsertHooks = {},
): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, hi - 1, mid);
    if (arr[mid]! < target) {
      lo = mid + 1;
      hooks.onShrink?.(lo, hi - 1, 'right');
    } else {
      hi = mid;
      hooks.onShrink?.(lo, hi - 1, 'left');
    }
  }
  hooks.onDone?.(lo);
  return lo;
}
