// =============================================================================
// 统计不同回文子序列数（LeetCode 730）
// dp[i][j] = s[i..j] 中不同回文子序列数（mod 1e9+7）。
// 1) s[i]!=s[j]: dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]
// 2) s[i]==s[j]=c:
//    - 区间 (i,j) 内无 c: dp[i][j] = 2*dp[i+1][j-1] + 2  (新单字符 c, "cc")
//    - 区间内仅 1 个 c: dp[i][j] = 2*dp[i+1][j-1] + 1   (新 "cc")
//    - 区间内 >=2 个 c（最左 low、最右 high）: dp[i][j] = 2*dp[i+1][j-1] - dp[low+1][high-1]
// 单字符视为长度1回文；空不计。
// =============================================================================

export interface CountPalHooks {
  onRange?: (i: number, j: number, value: number) => void;
  onResult?: (count: number) => void;
}

export interface CountPalResult {
  count: number;
  mod: number;
}

export function countDifferentPalindromicSubsequences(
  s: string,
  hooks: CountPalHooks = {},
): CountPalResult {
  const MOD = 1_000_000_007;
  const n = s.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return { count: 0, mod: MOD };
  }
  // dp[i][j]：long 类型运算（用普通 number，注意可能溢出但取模后回正）
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  // 长度 1
  for (let i = 0; i < n; i++) {
    dp[i]![i] = 1;
    hooks.onRange?.(i, i, 1);
  }

  const mod = (x: number): number => ((x % MOD) + MOD) % MOD;

  // 按长度递增
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] !== s[j]) {
        dp[i]![j] = mod(dp[i + 1]![j]! + dp[i]![j - 1]! - dp[i + 1]![j - 1]!);
      } else {
        const c = s[i];
        // 在 (i,j) 内找最左/最右的 c
        let low = -1;
        let high = -1;
        for (let k = i + 1; k < j; k++) {
          if (s[k] === c) {
            if (low === -1) low = k;
            high = k;
          }
        }
        if (low === -1) {
          // 无 c
          dp[i]![j] = mod(2 * (dp[i + 1]![j - 1] ?? 0) + 2);
        } else if (low === high) {
          // 仅 1 个 c
          dp[i]![j] = mod(2 * (dp[i + 1]![j - 1] ?? 0) + 1);
        } else {
          // >=2 个 c
          dp[i]![j] = mod(2 * (dp[i + 1]![j - 1] ?? 0) - (dp[low + 1]![high - 1] ?? 0));
        }
      }
      hooks.onRange?.(i, j, dp[i]![j]!);
    }
  }

  const count = mod(dp[0]![n - 1]!);
  hooks.onResult?.(count);
  return { count, mod: MOD };
}
