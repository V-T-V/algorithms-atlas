// =============================================================================
// 最长重复子数组 · 纯算法实现
// dp[i][j] = 以 nums1[i-1],nums2[j-1] 结尾的最长公共子数组。
// =============================================================================

export interface FindLengthHooks {
  onCompare?: (i: number, j: number, equal: boolean, val: number) => void;
  onResult?: (length: number) => void;
}

export function findLength(
  nums1: readonly number[],
  nums2: readonly number[],
  hooks: FindLengthHooks = {},
): number {
  const m = nums1.length;
  const n = nums2.length;
  if (m === 0 || n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  // dp[i][j]，为方便 trace 使用二维表
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  let ans = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let val = 0;
      if (nums1[i - 1] === nums2[j - 1]) {
        val = dp[i - 1]![j - 1]! + 1;
        dp[i]![j] = val;
        ans = Math.max(ans, val);
      }
      hooks.onCompare?.(i - 1, j - 1, nums1[i - 1] === nums2[j - 1], val);
    }
  }
  hooks.onResult?.(ans);
  return ans;
}
