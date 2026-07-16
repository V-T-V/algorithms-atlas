// =============================================================================
// 统计出现次数（Count Occurrence）· 纯算法实现
// 在升序数组中统计 target 出现的次数。利用二分找左右边界。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CountOccurrenceHooks {
  /** 在 [lo,hi] 区间探测中点 mid。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 区间收缩。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成，给出出现次数（可能为 0）。 */
  onDone?: (count: number, left: number, right: number) => void;
}

/** 左边界：第一个 >= target 的下标（lower bound）。 */
function lowerBound(arr: readonly number[], target: number, hooks: CountOccurrenceHooks): number {
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
  return lo;
}

/** 右边界：第一个 > target 的下标（upper bound）。 */
function upperBound(arr: readonly number[], target: number, hooks: CountOccurrenceHooks): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, hi - 1, mid);
    if (arr[mid]! <= target) {
      lo = mid + 1;
      hooks.onShrink?.(lo, hi - 1, 'right');
    } else {
      hi = mid;
      hooks.onShrink?.(lo, hi - 1, 'left');
    }
  }
  return lo;
}

/**
 * 统计 target 在升序数组中的出现次数。
 * @returns 出现次数（0 表示不存在）
 */
export function countOccurrence(
  arr: readonly number[],
  target: number,
  hooks: CountOccurrenceHooks = {},
): number {
  const left = lowerBound(arr, target, hooks);
  const right = upperBound(arr, target, hooks);
  const count = right - left;
  hooks.onDone?.(count, left, right - 1);
  return count;
}
