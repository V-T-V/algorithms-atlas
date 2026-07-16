// =============================================================================
// 旋转数组搜索（Search in Rotated Sorted Array）· 纯算法实现
// 升序数组经旋转，用二分 O(log n) 找 target（无重复）。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SearchRotateHooks {
  /** 在 [lo,hi] 区间探测中点 mid。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 区间收缩，并标注哪一半有序、target 落在哪半。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right', sortedHalf: 'left' | 'right') => void;
  /** 计算完成。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 在旋转过的升序（无重复）数组中找 target。
 * @returns 下标；不存在返回 -1。
 */
export function searchRotate(
  arr: readonly number[],
  target: number,
  hooks: SearchRotateHooks = {},
): number {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, hi, mid);
    const v = arr[mid]!;
    if (v === target) {
      hooks.onDone?.(mid);
      return mid;
    }
    // 判断哪一半有序
    if (arr[lo]! <= v) {
      // 左半 [lo..mid] 有序
      if (arr[lo]! <= target && target < v) {
        hi = mid - 1;
        hooks.onShrink?.(lo, hi, 'left', 'left');
      } else {
        lo = mid + 1;
        hooks.onShrink?.(lo, hi, 'right', 'left');
      }
    } else {
      // 右半 [mid..hi] 有序
      if (v < target && target <= arr[hi]!) {
        lo = mid + 1;
        hooks.onShrink?.(lo, hi, 'right', 'right');
      } else {
        hi = mid - 1;
        hooks.onShrink?.(lo, hi, 'left', 'right');
      }
    }
  }
  hooks.onDone?.(-1);
  return -1;
}
