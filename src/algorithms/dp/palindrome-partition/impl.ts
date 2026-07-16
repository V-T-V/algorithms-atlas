// =============================================================================
// 回文分割 Palindrome Partition · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 132）：把字符串 s 分割成若干回文子串的最少分割次数。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PalindromePartitionHooks {
  /** dp[i] 已求值：把 s[0..i) 分割为回文子串的最少段数；bestJ 为最优的「上一段起点 j」。 */
  onFillCell?: (i: number, segCount: number, bestJ: number) => void;
  /** 标记 s[j..i) 为回文（区间 DP 预处理发现）。 */
  onPalindrome?: (lo: number, hi: number) => void;
  /** 算法完成：返回最少「切刀数」（段数 - 1）。 */
  onDone?: (cuts: number) => void;
}

/**
 * 回文分割 II（LeetCode 132）：把 `s` 切成若干段回文子串，求最少切几刀。
 *
 * 先用区间 DP 预处理回文表 `pal[i][j]` = `s[i..j]` 是否回文：
 *   - `pal[i][i] = true`
 *   - `pal[i][i+1] = (s[i] === s[i+1])`
 *   - `pal[i][j] = (s[i] === s[j] && pal[i+1][j-1])`（长度 ≥ 3，从短到长枚举）
 *
 * 再用线性 DP：`dp[i]` = `s[0..i)` 的最少分割次数。
 *   - `dp[0] = 0`
 *   - 若 `pal[0][i-1]`：`dp[i] = 0`（整段即回文）
 *   - 否则 `dp[i] = min(dp[j] + 1)` over `j ∈ [1, i-1]` 且 `pal[j][i-1]`
 *
 * 答案为 `dp[n]`。
 *
 * 时间 `O(n²)`，空间 `O(n²)`。
 *
 * @param s 任意字符串
 * @returns 最少分割次数；空串/单字符/全回文返回 0
 */
export function palindromePartition(s: string, hooks: PalindromePartitionHooks = {}): number {
  const n = s.length;
  if (n <= 1) {
    hooks.onDone?.(0);
    return 0;
  }

  // 回文表
  const pal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  for (let i = 0; i < n; i++) {
    pal[i]![i] = true;
    hooks.onPalindrome?.(i, i);
  }
  for (let i = 0; i + 1 < n; i++) {
    if (s[i] === s[i + 1]) {
      pal[i]![i + 1] = true;
      hooks.onPalindrome?.(i, i + 1);
    }
  }
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j] && pal[i + 1]![j - 1]!) {
        pal[i]![j] = true;
        hooks.onPalindrome?.(i, j);
      }
    }
  }

  // dp[i] = s[0..i) 的最少分割次数（i ∈ [0..n]）
  const dp = new Array<number>(n + 1).fill(Infinity);
  dp[0] = 0;
  hooks.onFillCell?.(0, 0, 0);
  for (let i = 1; i <= n; i++) {
    let bestJ = -1;
    for (let j = 0; j < i; j++) {
      // j ∈ [0..i-1]，子串 s[j..i-1]
      if (pal[j]![i - 1]! && dp[j]! + 1 < dp[i]!) {
        dp[i] = dp[j]! + 1;
        bestJ = j;
      }
    }
    // 若 s[0..i-1] 整段回文，dp[i] 应为 1（一段）
    hooks.onFillCell?.(i, dp[i]!, bestJ);
  }

  // dp[n] = 最少段数；切刀数 = 段数 - 1
  const cuts = dp[n]! - 1;
  hooks.onDone?.(cuts);
  return cuts;
}
