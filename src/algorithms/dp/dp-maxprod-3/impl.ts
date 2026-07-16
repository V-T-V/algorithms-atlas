// =============================================================================
// 最大子数组乘积 · 纯算法实现
// =============================================================================
export interface MaxProdHooks {
  onElement?: (i: number, x: number, maxP: number, minP: number) => void;
  onDone?: (max: number) => void;
}

export function maxProduct(nums: readonly number[], hooks: MaxProdHooks = {}): number {
  if (nums.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  let ans = nums[0]!,
    maxP = nums[0]!,
    minP = nums[0]!;
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i]!;
    const a = maxP * x,
      b = minP * x;
    maxP = Math.max(x, a, b);
    minP = Math.min(x, a, b);
    if (maxP > ans) ans = maxP;
    hooks.onElement?.(i, x, maxP, minP);
  }
  hooks.onDone?.(ans);
  return ans;
}
