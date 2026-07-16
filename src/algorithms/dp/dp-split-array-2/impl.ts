// =============================================================================
// 分割数组最大和 · 二分答案
// =============================================================================

export interface SplitArrayHooks {
  onProbe?: (limit: number, feasible: boolean, groups: number) => void;
  onDone?: (best: number) => void;
}

function canSplit(
  nums: readonly number[],
  m: number,
  limit: number,
): { ok: boolean; groups: number } {
  let groups = 1;
  let sum = 0;
  for (const x of nums) {
    if (x > limit) return { ok: false, groups };
    if (sum + x > limit) {
      groups++;
      sum = x;
      if (groups > m) return { ok: false, groups };
    } else {
      sum += x;
    }
  }
  return { ok: true, groups };
}

export function splitArray(
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
    const mid = (lo + hi) >> 1;
    const r = canSplit(nums, m, mid);
    hooks.onProbe?.(mid, r.ok, r.groups);
    if (r.ok) {
      ans = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  hooks.onDone?.(ans);
  return ans;
}
