// =============================================================================
// 最长递增子序列（贪心+二分）· 纯算法实现
// =============================================================================
export interface LisHooks {
  onTail?: (idx: number, value: number) => void;
  onBinarySearch?: (x: number, lo: number, hi: number) => void;
  onDone?: (length: number) => void;
}

export function lengthOfLIS(nums: readonly number[], hooks: LisHooks = {}): number {
  if (nums.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const tails: number[] = [];
  for (const x of nums) {
    let lo = 0,
      hi = tails.length;
    while (lo < hi) {
      hooks.onBinarySearch?.(x, lo, hi);
      const mid = (lo + hi) >> 1;
      if (tails[mid]! < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(x);
    else tails[lo] = x;
    hooks.onTail?.(lo, x);
  }
  hooks.onDone?.(tails.length);
  return tails.length;
}
