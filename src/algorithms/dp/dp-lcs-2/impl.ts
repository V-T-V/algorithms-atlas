// =============================================================================
// 最短公共超序列长度 · 纯算法实现
// SCS(s1,s2)：dp[i][j] = s1[0..i) 与 s2[0..j) 的 SCS 长度。
// 边界 dp[0][j]=j, dp[i][0]=i。
// 转移：s1[i-1]==s2[j-1] => dp[i][j]=dp[i-1][j-1]+1
//       否则 => dp[i][j]=min(dp[i-1][j], dp[i][j-1])+1
// 等价：SCS = n + m - LCS
// =============================================================================

export interface ScsHooks {
  onInit?: (n: number, m: number) => void;
  onCell?: (i: number, j: number, val: number) => void;
  onDone?: (len: number) => void;
}

export function scsLength(s1: string, s2: string, hooks: ScsHooks = {}): number {
  const n = s1.length;
  const m = s2.length;
  const W = m + 1;
  const dp = new Array<number>((n + 1) * W).fill(0);
  hooks.onInit?.(n, m);
  for (let i = 0; i <= n; i++) dp[i * W + 0] = i;
  for (let j = 0; j <= m; j++) dp[0 * W + j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      let v: number;
      if (s1[i - 1] === s2[j - 1]) {
        v = dp[(i - 1) * W + (j - 1)]! + 1;
      } else {
        v = Math.min(dp[(i - 1) * W + j]!, dp[i * W + (j - 1)]!) + 1;
      }
      dp[i * W + j] = v;
      hooks.onCell?.(i, j, v);
    }
  }
  const ans = dp[n * W + m]!;
  hooks.onDone?.(ans);
  return ans;
}
