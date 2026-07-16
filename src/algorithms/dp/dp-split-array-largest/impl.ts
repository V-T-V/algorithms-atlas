// =============================================================================
// 分割数组的最大值 · 纯算法实现（二分答案 + 贪心）
// =============================================================================

export interface SplitArrayHooks {
  onCheck?: (limit: number, segments: number, feasible: boolean) => void;
  onDone?: (best: number) => void;
}

/** 在上限 limit 下最少需要多少段。 */
function countSegments(nums: readonly number[], limit: number): number {
  let segs = 1;
  let cur = 0;
  for (const x of nums) {
    if (cur + x <= limit) {
      cur += x;
    } else {
      segs++;
      cur = x;
    }
  }
  return segs;
}

export function splitArrayLargest(
  nums: readonly number[],
  m: number,
  hooks: SplitArrayHooks = {},
): number {
  let lo = 0;
  let hi = 0;
  for (const x of nums) {
    if (x > lo) lo = x;
    hi += x;
  }
  let ans = hi;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const segs = countSegments(nums, mid);
    const feasible = segs <= m;
    hooks.onCheck?.(mid, segs, feasible);
    if (feasible) {
      ans = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  hooks.onDone?.(ans);
  return ans;
}
