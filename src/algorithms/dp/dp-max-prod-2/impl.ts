// =============================================================================
// 乘积最大子数组
// =============================================================================

export interface MaxProdHooks {
  onStep?: (i: number, x: number, curMax: number, curMin: number, best: number) => void;
  onDone?: (best: number) => void;
}

export function maxProduct(nums: readonly number[], hooks: MaxProdHooks = {}): number {
  if (nums.length === 0) return 0;
  let best = nums[0]!;
  let curMax = nums[0]!;
  let curMin = nums[0]!;
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i]!;
    if (x < 0) {
      const t = curMax;
      curMax = curMin;
      curMin = t;
    }
    curMax = Math.max(x, curMax * x);
    curMin = Math.min(x, curMin * x);
    best = Math.max(best, curMax);
    hooks.onStep?.(i, x, curMax, curMin, best);
  }
  hooks.onDone?.(best);
  return best;
}
