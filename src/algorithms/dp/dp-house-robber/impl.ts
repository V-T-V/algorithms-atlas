// =============================================================================
// 打家劫舍（线性）· 纯算法实现
// 相邻两屋不能同时抢；求最大收益。dp[i] = max(dp[i-1], dp[i-2]+nums[i])。
// =============================================================================

export interface HouseRobberHooks {
  onStep?: (i: number, val: number, took: boolean) => void;
  onResult?: (total: number, chosen: number[]) => void;
}

export function houseRobber(
  nums: readonly number[],
  hooks: HouseRobberHooks = {},
): { total: number; chosen: number[] } {
  const n = nums.length;
  if (n === 0) {
    hooks.onResult?.(0, []);
    return { total: 0, chosen: [] };
  }
  // dp[i] = 前 i+1 屋的最大收益；take[i] 记录是否抢第 i 屋（用于回溯）
  const dp: number[] = new Array<number>(n).fill(0);
  dp[0] = nums[0]!;
  const took0 = nums[0]! > 0;
  hooks.onStep?.(0, dp[0], took0);
  if (n >= 2) {
    if (nums[1]! >= dp[0]) {
      dp[1] = nums[1]!;
    } else {
      dp[1] = dp[0];
    }
    hooks.onStep?.(1, dp[1], nums[1]! >= dp[0]);
  }
  for (let i = 2; i < n; i++) {
    const take = dp[i - 2]! + nums[i]!;
    const skip = dp[i - 1]!;
    dp[i] = Math.max(take, skip);
    hooks.onStep?.(i, dp[i]!, take > skip);
  }
  // 回溯
  const chosen: number[] = [];
  let i = n - 1;
  while (i >= 0) {
    const cur = dp[i]!;
    const prev = i >= 1 ? dp[i - 1]! : -Infinity;
    if (cur !== prev) {
      chosen.push(i);
      i -= 2;
    } else {
      i -= 1;
    }
  }
  chosen.reverse();
  const total = dp[n - 1]!;
  hooks.onResult?.(total, chosen);
  return { total, chosen };
}
