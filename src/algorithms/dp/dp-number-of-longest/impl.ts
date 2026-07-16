// =============================================================================
// 最长递增子序列个数 · 纯算法实现
// length[i] / count[i] 双 DP。
// =============================================================================

export interface NumberOfLongestHooks {
  onPair?: (j: number, i: number) => void;
  onUpdate?: (i: number, length: number, count: number) => void;
  onResult?: (length: number, count: number) => void;
}

export function findNumberOfLIS(nums: readonly number[], hooks: NumberOfLongestHooks = {}): number {
  const n = nums.length;
  if (n === 0) {
    hooks.onResult?.(0, 0);
    return 0;
  }
  const length: number[] = new Array<number>(n).fill(1);
  const count: number[] = new Array<number>(n).fill(1);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      hooks.onPair?.(j, i);
      if (nums[j]! < nums[i]!) {
        if (length[j]! + 1 > length[i]!) {
          length[i] = length[j]! + 1;
          count[i] = count[j]!;
        } else if (length[j]! + 1 === length[i]!) {
          count[i] = count[i]! + count[j]!;
        }
      }
    }
    hooks.onUpdate?.(i, length[i]!, count[i]!);
  }
  let maxLen = 0;
  let ans = 0;
  for (let i = 0; i < n; i++) maxLen = Math.max(maxLen, length[i]!);
  for (let i = 0; i < n; i++) {
    if (length[i] === maxLen) ans += count[i]!;
  }
  hooks.onResult?.(maxLen, ans);
  return ans;
}
