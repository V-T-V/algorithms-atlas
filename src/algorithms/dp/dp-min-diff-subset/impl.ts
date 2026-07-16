// =============================================================================
// 最小差子集分割 · 纯算法实现
// 0/1 背包可达性：dp[j] 表示子集和 j 可达；倒序更新。
// =============================================================================

export interface MinDiffHooks {
  onItem?: (i: number, num: number) => void;
  onReach?: (j: number) => void;
  onResult?: (diff: number, s1: number) => void;
}

export function minDiffSubset(nums: readonly number[], hooks: MinDiffHooks = {}): number {
  const n = nums.length;
  if (n === 0) {
    hooks.onResult?.(0, 0);
    return 0;
  }
  const sum = nums.reduce((a, b) => a + b, 0);
  const half = Math.floor(sum / 2);
  const dp: boolean[] = new Array<boolean>(half + 1).fill(false);
  dp[0] = true;
  for (let i = 0; i < n; i++) {
    hooks.onItem?.(i, nums[i]!);
    for (let j = half; j >= nums[i]!; j--) {
      if (dp[j - nums[i]!] && !dp[j]!) {
        dp[j] = true;
        hooks.onReach?.(j);
      }
    }
  }
  let s1 = 0;
  for (let j = half; j >= 0; j--) {
    if (dp[j]!) {
      s1 = j;
      break;
    }
  }
  const diff = sum - 2 * s1;
  hooks.onResult?.(diff, s1);
  return diff;
}
