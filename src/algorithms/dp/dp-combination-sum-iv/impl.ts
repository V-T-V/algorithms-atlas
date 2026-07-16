// =============================================================================
// 组合总和 IV（排列数）· 纯算法实现
// dp[j] = 凑成 j 的排列数；外层 target，内层 nums。
// =============================================================================

export interface CombinationSumIVHooks {
  onFill?: (j: number, val: number) => void;
  onResult?: (count: number) => void;
}

export function combinationSum4(
  nums: readonly number[],
  target: number,
  hooks: CombinationSumIVHooks = {},
): number {
  const dp: number[] = new Array<number>(target + 1).fill(0);
  dp[0] = 1;
  for (let j = 1; j <= target; j++) {
    for (const num of nums) {
      if (num <= j) dp[j] = dp[j]! + dp[j - num]!;
    }
    hooks.onFill?.(j, dp[j]!);
  }
  hooks.onResult?.(dp[target]!);
  return dp[target]!;
}
