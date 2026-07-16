// =============================================================================
// 最长等差数列（LeetCode 1027）· 纯算法实现
// dp[i][d] = 以 nums[i] 结尾、公差为 d 的最长等差子序列长度。
//   对每个 j<i，d=nums[i]-nums[j]，dp[i][d]=dp[j][d]+1。
// 用 Map<number, Map<number, number>> 存储（外层 index，内层 diff）。
// =============================================================================

export interface LongestArithHooks {
  onCheck?: (i: number, j: number, diff: number, len: number) => void;
  onResult?: (maxLen: number) => void;
}

export function longestArithSequence(
  nums: readonly number[],
  hooks: LongestArithHooks = {},
): number {
  const n = nums.length;
  if (n <= 1) {
    hooks.onResult?.(n);
    return n;
  }
  // dp[i] 是一个 Map<diff, length>
  const dp: Map<number, number>[] = new Array(n);
  for (let i = 0; i < n; i++) dp[i] = new Map();
  let best = 2;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const diff = nums[i]! - nums[j]!;
      const prev = dp[j]!.get(diff) ?? 1;
      const cur = prev + 1;
      if (cur > (dp[i]!.get(diff) ?? 0)) {
        dp[i]!.set(diff, cur);
        hooks.onCheck?.(i, j, diff, cur);
        if (cur > best) best = cur;
      }
    }
  }
  hooks.onResult?.(best);
  return best;
}
