// =============================================================================
// 寻找峰值（Find Peak Element）· 纯算法实现
// 在数组中找一个「峰值」下标：比相邻元素都大（边界外视为 -∞）。
// 用二分 O(log n) 找任意一个峰。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FindPeakHooks {
  /** 在 [lo,hi] 区间探测中点 mid，与右邻居比较决定方向。 */
  onProbe?: (lo: number, hi: number, mid: number) => void;
  /** 区间收缩：'right' 去右半（上坡），'left' 去左半（下坡）。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成，给出峰值下标。 */
  onDone?: (peakIndex: number) => void;
}

/**
 * 找任意一个峰值下标。nums[i] 为峰当且仅当大于其左右邻居。
 * @returns 峰值下标；空数组返回 -1。
 */
export function findPeak(nums: readonly number[], hooks: FindPeakHooks = {}): number {
  const n = nums.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, hi, mid);
    if (nums[mid]! < nums[mid + 1]!) {
      // 右侧更高，右侧必有峰
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
