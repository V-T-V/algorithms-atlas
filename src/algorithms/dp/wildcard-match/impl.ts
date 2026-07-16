// =============================================================================
// 通配符匹配 Wildcard Match（? 与 *）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 44）：支持 '?'（任意单字符）与 '*'（任意长度，含空）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface WildcardMatchHooks {
  /** dp[i][j] 已求值：s[0..i) 是否匹配 p[0..j)。 */
  onFillCell?: (
    i: number,
    j: number,
    val: boolean,
    from: 'star-match' | 'star-empty' | 'char' | 'qmark',
  ) => void;
  /** 算法完成。 */
  onDone?: (ok: boolean) => void;
}

/**
 * 通配符匹配（LeetCode 44）。
 *
 * 支持 `?`（匹配任意单字符）和 `*`（匹配任意长度序列，含空）。判断 `s` 是否能被 `p` 整串匹配。
 *
 * 二维 DP：`dp[i][j]` = `s[0..i)` 是否匹配 `p[0..j)`。
 *   - `dp[0][0] = true`
 *   - 空串对 `p` 前导连续 `*` 全匹配：`dp[0][j] = dp[0][j-1]`（当 `p[j-1]==='*'`）
 *   - 若 `p[j-1] === '*'`：`dp[i][j] = dp[i-1][j]`（`*` 吃一个字符）|| `dp[i][j-1]`（`*` 匹配空）
 *   - 否则若 `p[j-1] === '?'` 或 `p[j-1] === s[i-1]`：`dp[i][j] = dp[i-1][j-1]`
 *   - 答案 = `dp[m][n]`
 *
 * 时间 `O(m·n)`，空间 `O(m·n)`（可滚动到 `O(n)`）。也可用贪心双指针做到 `O(m+n)`。
 *
 * @param s 输入串
 * @param p 模式（含 '?' 与 '*'）
 * @returns 是否匹配
 */
export function wildcardMatch(s: string, p: string, hooks: WildcardMatchHooks = {}): boolean {
  const m = s.length;
  const n = p.length;

  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    new Array<boolean>(n + 1).fill(false),
  );
  dp[0]![0] = true;
  hooks.onFillCell?.(0, 0, true, 'char');

  // 空串与前导连续 *
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === '*' && dp[0]![j - 1]!) {
      dp[0]![j] = true;
      hooks.onFillCell?.(0, j, true, 'star-empty');
    } else {
      break;
    }
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        const val = dp[i - 1]![j]! || dp[i]![j - 1]!;
        dp[i]![j] = val;
        hooks.onFillCell?.(i, j, val, val && dp[i - 1]![j]! ? 'star-match' : 'star-empty');
      } else {
        const q = p[j - 1] === '?' || p[j - 1] === s[i - 1];
        dp[i]![j] = q && dp[i - 1]![j - 1]!;
        hooks.onFillCell?.(i, j, dp[i]![j]!, p[j - 1] === '?' ? 'qmark' : 'char');
      }
    }
  }

  hooks.onDone?.(dp[m]![n]!);
  return dp[m]![n]!;
}
