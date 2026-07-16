// =============================================================================
// 峰值下标（Peak Index in a Mountain Array）· 纯算法实现
// 山脉数组：先严格递增后严格递减，求峰顶下标。二分 O(log n)。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PeakIndexHooks {
  /** 在 [lo,hi] 区间探测中点 mid，与右邻居比较。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 区间收缩。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成。 */
  onDone?: (peakIndex: number) => void;
}

/**
 * 在山脉数组（先增后减）中找峰顶下标。
 * @returns 峰顶下标；空数组返回 -1。
 */
export function peakIndex(arr: readonly number[], hooks: PeakIndexHooks = {}): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, hi, mid);
    if (arr[mid]! < arr[mid + 1]!) {
      // 还在上坡，峰顶在右
      lo = mid + 1;
      hooks.onShrink?.(lo, hi, 'right');
    } else {
      hi = mid;
      hooks.onShrink?.(lo, hi, 'left');
    }
  }
  hooks.onDone?.(lo);
  return lo;
}
