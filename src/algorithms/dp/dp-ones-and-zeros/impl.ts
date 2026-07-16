// =============================================================================
// 一和零（LeetCode 474）· 纯算法实现
// 给定 strs 字符串数组，每串含若干 0 和 1；背包容量 (m 个 0, n 个 1)，求最多选多少串。
// 二维 0/1 背包：dp[j][k] = 用 j 个 0、k 个 1 时的最大子集大小。
//   倒序更新避免重复使用。
// =============================================================================

export interface OnesZerosHooks {
  onItem?: (s: string, zeros: number, ones: number) => void;
  onUpdate?: (j: number, k: number, val: number) => void;
  onResult?: (max: number) => void;
}

export function onesAndZeros(
  strs: readonly string[],
  m: number,
  n: number,
  hooks: OnesZerosHooks = {},
): number {
  // dp[j][k]
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (const s of strs) {
    let zeros = 0;
    let ones = 0;
    for (const ch of s) {
      if (ch === '0') zeros++;
      else if (ch === '1') ones++;
    }
    hooks.onItem?.(s, zeros, ones);
    for (let j = m; j >= zeros; j--) {
      for (let k = n; k >= ones; k--) {
        const cand = dp[j - zeros]![k - ones]! + 1;
        if (cand > dp[j]![k]!) {
          dp[j]![k] = cand;
          hooks.onUpdate?.(j, k, cand);
        }
      }
    }
  }
  const ans = dp[m]![n]!;
  hooks.onResult?.(ans);
  return ans;
}
