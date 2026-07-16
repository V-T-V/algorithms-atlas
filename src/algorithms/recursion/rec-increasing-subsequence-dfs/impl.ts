// 最长递增子序列（DFS）· 实现

export interface LisHooks {
  onCompute?: (index: number, length: number) => void;
}

/**
 * DFS + 记忆化求 LIS 长度。
 * lis(i) = 以 nums[i] 结尾的 LIS 长度。
 */
export function lengthOfLIS(nums: number[], hooks: LisHooks = {}): number {
  const n = nums.length;
  if (n === 0) return 0;
  const memo = new Array<number>(n).fill(-1);

  const lis = (i: number): number => {
    if (memo[i] !== -1) return memo[i]!;
    let best = 1;
    for (let j = 0; j < i; j++) {
      if (nums[j]! < nums[i]!) {
        const sub = lis(j) + 1;
        if (sub > best) best = sub;
      }
    }
    memo[i] = best;
    hooks.onCompute?.(i, best);
    return best;
  };

  let maxLen = 0;
  for (let i = 0; i < n; i++) maxLen = Math.max(maxLen, lis(i));
  return maxLen;
}

/** 返回一个 LIS（不只是长度）。 */
export function findLIS(nums: number[]): number[] {
  const n = nums.length;
  if (n === 0) return [];
  const memo = new Array<number>(n).fill(-1);
  const choice = new Array<number>(n).fill(-1); // 记录转移来源
  const lis = (i: number): number => {
    if (memo[i] !== -1) return memo[i]!;
    let best = 1;
    let from = -1;
    for (let j = 0; j < i; j++) {
      if (nums[j]! < nums[i]!) {
        const sub = lis(j) + 1;
        if (sub > best) {
          best = sub;
          from = j;
        }
      }
    }
    memo[i] = best;
    choice[i] = from;
    return best;
  };
  let endAt = 0;
  let maxLen = 0;
  for (let i = 0; i < n; i++) {
    if (lis(i) > maxLen) {
      maxLen = lis(i);
      endAt = i;
    }
  }
  // 回溯构造
  const seq: number[] = [];
  let cur = endAt;
  while (cur !== -1) {
    seq.push(nums[cur]!);
    cur = choice[cur]!;
  }
  return seq.reverse();
}
