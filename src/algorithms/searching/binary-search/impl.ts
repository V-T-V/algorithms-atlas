// =============================================================================
// 二分查找 Binary Search · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BinarySearchHooks {
  /** 计算中点并比较 a[mid] 与 target。返回前的探测事件。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 缩小区间：dir='left' 表示 target 在左半（含 mid），'right' 表示右半。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 查找结束，给出结果（命中下标，或 -1 表示未找到）。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 二分查找：在**升序**数组中查找 target，返回其下标；不存在返回 -1。
 * 要求输入数组已按非降序排列。
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function binarySearch(
  arr: readonly number[],
  target: number,
  hooks: BinarySearchHooks = {},
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
    } else if (v < target) {
      lo = mid + 1;
      hooks.onShrink?.(lo, hi, 'right');
    } else {
      hi = mid - 1;
      hooks.onShrink?.(lo, hi, 'left');
    }
  }
  hooks.onDone?.(-1);
  return -1;
}
