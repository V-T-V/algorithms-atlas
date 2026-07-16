// =============================================================================
// 正则匹配 Regex Match（. 与 *）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 10）：支持 '.'（任意单字符）与 '*'（前一个字符出现 0 次或多次）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface RegexMatchHooks {
  /** dp[i][j] 已求值：s[0..i) 是否匹配 p[0..j)。 */
  onFillCell?: (
    i: number,
    j: number,
    val: boolean,
    from: 'star-match' | 'star-skip' | 'single',
  ) => void;
  /** 算法完成。 */
  onDone?: (ok: boolean) => void;
}

/**
 * 正则匹配（LeetCode 10）。
 *
 * 支持 `.`（匹配任意单字符）和 `*`（让前一个字符出现 0 次或多次）。`*` 保证合法（必跟在一个普通字符或 `.` 后）。
 *
 * 二维 DP：`dp[i][j]` = `s[0..i)` 是否能被 `p[0..j)` 匹配。
 *   - `dp[0][0] = true`（空串匹配空模式）
 *   - 若 `p[j-1] === '*'`：
 *       - 0 次：`dp[i][j] = dp[i][j-2]`（删除「x*」）
 *       - ≥1 次：当 `i>0 && (p[j-2]==='.' || p[j-2]===s[i-1])`，`dp[i][j] ||= dp[i-1][j]`（消耗一个 s 字符，仍保留 `x*`）
 *   - 否则（普通字符或 `.`）：当 `i>0 && (p[j-1]==='.' || p[j-1]===s[i-1])`，`dp[i][j] = dp[i-1][j-1]`
 *   - 答案 = `dp[m][n]`
 *
 * 时间 `O(m·n)`，空间 `O(m·n)`。
 *
 * @param s 输入串
 * @param p 模式（含 '.' 与 '*'）
 * @returns 是否匹配
 */
export function regexMatch(s: string, p: string, hooks: RegexMatchHooks = {}): boolean {
  const m = s.length;
  const n = p.length;

  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    new Array<boolean>(n + 1).fill(false),
  );
  dp[0]![0] = true;
  hooks.onFillCell?.(0, 0, true, 'single');

  // 空串与形如 a*b*c* 的前缀匹配
  for (let j = 2; j <= n; j += 2) {
    if (p[j - 1] === '*' && dp[0]![j - 2]!) {
      dp[0]![j] = true;
      hooks.onFillCell?.(0, j, true, 'star-skip');
    }
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        // 0 次：删除 x*
        let val = dp[i]![j - 2]!;
        let from: 'star-match' | 'star-skip' | 'single' = 'star-skip';
        // ≥1 次：s[i-1] 能被 x 匹配
        const x = p[j - 2]!;
        if (!val && i > 0 && (x === '.' || x === s[i - 1])) {
          val = dp[i - 1]![j]!;
          from = 'star-match';
        }
        // 也可能两者都贡献（|| 语义），上面取了首个真
        dp[i]![j] = dp[i]![j - 2]! || ((x === '.' || x === s[i - 1]) && dp[i - 1]![j]!);
        hooks.onFillCell?.(i, j, dp[i]![j]!, from);
      } else {
        const c = p[j - 1]!;
        const ok = c === '.' || c === s[i - 1];
        dp[i]![j] = ok && dp[i - 1]![j - 1]!;
        hooks.onFillCell?.(i, j, dp[i]![j]!, 'single');
      }
    }
  }

  hooks.onDone?.(dp[m]![n]!);
  return dp[m]![n]!;
}
