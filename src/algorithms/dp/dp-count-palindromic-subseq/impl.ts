// =============================================================================
// 回文子序列计数 · 纯算法实现
// dp[i][j] = s[i..j] 内（按位置计数，位置不同即视为不同）回文子序列个数。
// 边界 dp[i][i]=1；空区间（i>j）按 0 处理。
// 转移：
//   s[i] != s[j] => dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]   （容斥）
//   s[i] == s[j] => dp[i][j] = dp[i+1][j] + dp[i][j-1] + 1
//       （两端字符相同：除左右两部分的回文外，额外新增「两端各加 s[i]」形成的回文，
//        数量等于 dp[i+1][j-1] 个内部回文两端加 s[i]，加上单个 "s[i]s[j]" 这一新回文；
//        合并后正好 dp[i+1][j] + dp[i][j-1] + 1）
// =============================================================================

export interface CountPalinSubseqHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onDone?: (total: number) => void;
}

/** 区间 [i,j] 的 dp 值，越界返回 0。 */
function get(dp: number[][], i: number, j: number): number {
  if (i > j) return 0;
  return dp[i]![j]!;
}

export function countPalindromicSubseq(s: string, hooks: CountPalinSubseqHooks = {}): number {
  const n = s.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) dp[i]![i] = 1;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      let v: number;
      if (s[i] === s[j]) {
        v = get(dp, i + 1, j) + get(dp, i, j - 1) + 1;
      } else {
        v = get(dp, i + 1, j) + get(dp, i, j - 1) - get(dp, i + 1, j - 1);
      }
      dp[i]![j] = v;
      hooks.onCell?.(i, j, v);
    }
  }
  const ans = dp[0]![n - 1]!;
  hooks.onDone?.(ans);
  return ans;
}
