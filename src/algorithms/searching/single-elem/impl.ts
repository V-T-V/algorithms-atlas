// =============================================================================
// 有序数组中的单一元素（Single Element in Sorted Array）· 纯算法实现
// 数组中除一个元素出现一次外，其余均出现两次且相邻排列；二分 O(log n) 找单一元素。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SingleElemHooks {
  /** 在 [lo,hi] 区间探测中点 mid（并规范化为偶数下标成对起点）。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 区间收缩。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成。 */
  onDone?: (singleIndex: number) => void;
}

/**
 * 找有序数组中唯一出现一次的元素下标（其余成对相邻出现）。
 * @returns 单一元素下标；空数组返回 -1。
 */
export function singleElem(arr: readonly number[], hooks: SingleElemHooks = {}): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    let mid = (lo + hi) >> 1;
    if (mid % 2 === 1) mid--; // 规范化到偶数下标（成对的第一半）
    hooks.onProbe?.(lo, hi, mid);
    if (arr[mid]! === arr[mid + 1]!) {
      // 成对正常，单一元素在 mid+2 及之后
      lo = mid + 2;
      hooks.onShrink?.(lo, hi, 'right');
    } else {
      // 配对断裂，单一元素在 mid 及之前
      hi = mid;
      hooks.onShrink?.(lo, hi, 'left');
    }
  }
  hooks.onDone?.(lo);
  return lo;
}
