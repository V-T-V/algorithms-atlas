// =============================================================================
// 最大乘积子数组 · 纯算法实现
// =============================================================================

export interface MaxProdHooks {
  onStep?: (i: number, curMax: number, curMin: number, best: number) => void;
  onDone?: (best: number) => void;
}

export function maxProductSubarray(nums: readonly number[], hooks: MaxProdHooks = {}): number {
  if (nums.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  let curMax = nums[0]!;
  let curMin = nums[0]!;
  let best = nums[0]!;
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i]!;
    const a = curMax * x;
    const b = curMin * x;
    curMax = Math.max(x, a, b);
    curMin = Math.min(x, a, b);
    if (curMax > best) best = curMax;
    hooks.onStep?.(i, curMax, curMin, best);
  }
  hooks.onDone?.(best);
  return best;
}
