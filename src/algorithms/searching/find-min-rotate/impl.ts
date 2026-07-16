// =============================================================================
// 旋转数组最小值（Find Minimum in Rotated Sorted Array）· 纯算法实现
// 升序数组经若干次旋转后，用二分找最小元素下标。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FindMinRotateHooks {
  /** 在 [lo,hi] 区间探测中点 mid，并与右端比较。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 区间收缩。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成，给出最小值所在下标。 */
  onDone?: (minIndex: number) => void;
}

/**
 * 在旋转过的升序（无重复）数组中找最小值的下标。
 * @returns 最小值下标；空数组返回 -1。
 */
export function findMinRotate(arr: readonly number[], hooks: FindMinRotateHooks = {}): number {
  if (arr.length === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, hi, mid);
    if (arr[mid]! > arr[hi]!) {
      // 最小值在右半
      lo = mid + 1;
      hooks.onShrink?.(lo, hi, 'right');
    } else {
      // 最小值在 mid 及其左侧
      hi = mid;
      hooks.onShrink?.(lo, hi, 'left');
    }
  }
  hooks.onDone?.(lo);
  return lo;
}

/** 取最小值本身。 */
export function findMinRotateValue(arr: readonly number[], hooks: FindMinRotateHooks = {}): number {
  const idx = findMinRotate(arr, hooks);
  return idx < 0 ? NaN : arr[idx]!;
}
