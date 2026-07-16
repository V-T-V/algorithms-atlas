// =============================================================================
// 最长回文子串 Longest Palindromic Substring · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// 区间 DP：dp[i][j] 表示 s[i..j]（闭区间）是否为回文。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LongestPalindromeHooks {
  /** 判定子串 s[i..j]（闭区间）是否为回文。 */
  onCheck?: (i: number, j: number, isPal: boolean) => void;
  /** 发现更长的回文子串 s[i..j]。 */
  onUpdateBest?: (i: number, j: number, length: number) => void;
}

/**
 * 最长回文子串（区间 DP）。
 *
 * 状态：`dp[i][j]` = `s[i..j]`（闭区间）是否为回文。
 *   - `dp[i][i] = true`（单字符）
 *   - `dp[i][i+1] = (s[i] === s[i+1])`（两字符）
 *   - 长度 ≥ 3：`dp[i][j] = (s[i] === s[j]) && dp[i+1][j-1]`
 * 按子串长度递增填表，过程中记录最长回文的起止。
 *
 * @returns 最长回文子串（存在多个时取最先出现的最长者）；空串返回 ''。
 */
export function longestPalindrome(s: string, hooks: LongestPalindromeHooks = {}): string {
  const n = s.length;
  if (n === 0) return '';
  if (n === 1) {
    hooks.onCheck?.(0, 0, true);
    hooks.onUpdateBest?.(0, 0, 1);
    return s;
  }

  // dp[i][j]：s[i..j] 是否回文（闭区间）
  const dp: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  let start = 0;
  let maxLen = 1;

  // 长度 1
  for (let i = 0; i < n; i++) {
    dp[i]![i] = true;
    hooks.onCheck?.(i, i, true);
  }
  hooks.onUpdateBest?.(0, 0, 1);

  // 长度 len 从 2 到 n
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      let isPal: boolean;
      if (len === 2) {
        isPal = s[i] === s[j];
      } else {
        isPal = s[i] === s[j] && dp[i + 1]![j - 1]!;
      }
      dp[i]![j] = isPal;
      hooks.onCheck?.(i, j, isPal);
      if (isPal && len > maxLen) {
        maxLen = len;
        start = i;
        hooks.onUpdateBest?.(i, j, len);
      }
    }
  }

  return s.slice(start, start + maxLen);
}
