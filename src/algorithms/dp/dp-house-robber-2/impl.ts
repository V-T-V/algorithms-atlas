// =============================================================================
// 打家劫舍 II（环形）· 纯算法实现
// 房屋首尾相邻，不能同时抢第一间和最后一间。转化为两个线性子问题：
//   (1) 抢 [0, n-2]；(2) 抢 [1, n-1]，取最大。复用线性 houseRobber 逻辑。
// =============================================================================

export interface HouseRobber2Hooks {
  onRange?: (range: number[], total: number) => void;
  onResult?: (total: number) => void;
}

function linearRob(nums: readonly number[]): number {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0]!;
  const dp: number[] = new Array<number>(n).fill(0);
  dp[0] = nums[0]!;
  dp[1] = Math.max(nums[0]!, nums[1]!);
  for (let i = 2; i < n; i++) dp[i] = Math.max(dp[i - 1]!, dp[i - 2]! + nums[i]!);
  return dp[n - 1]!;
}

export function houseRobber2(nums: readonly number[], hooks: HouseRobber2Hooks = {}): number {
  const n = nums.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  if (n === 1) {
    hooks.onResult?.(nums[0]!);
    return nums[0]!;
  }
  const r1 = linearRob(nums.slice(0, n - 1));
  hooks.onRange?.([0, n - 2], r1);
  const r2 = linearRob(nums.slice(1));
  hooks.onRange?.([1, n - 1], r2);
  const ans = Math.max(r1, r2);
  hooks.onResult?.(ans);
  return ans;
}
