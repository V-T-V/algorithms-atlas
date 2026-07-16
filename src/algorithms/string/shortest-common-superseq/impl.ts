// =============================================================================
// 最短公共超序列（Shortest Common Supersequence, SCS）· 纯算法实现
// 最短字符串，使 a、b 都是其子序列。长度 = |a| + |b| - |LCS(a,b)|。
// DP 求 LCS 长度矩阵后回溯构造超序列本身。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ScsHooks {
  /** 计算完 dp[i][j]（LCS 长度矩阵）。 */
  onCell?: (i: number, j: number, value: number) => void;
  /** 回溯构造超序列：在 (i,j) 处选择放入字符 ch（来自 a 或 b）。 */
  onBacktrack?: (i: number, j: number, ch: string, from: 'a' | 'b' | 'both') => void;
  /** 计算完成。 */
  onDone?: (length: number, superseq: string) => void;
}

/**
 * 最短公共超序列：返回同时包含 a、b 作为子序列的最短字符串。
 *
 * DP：先求 LCS 长度矩阵 dp[i][j] = a[0..i-1] 与 b[0..j-1] 的 LCS 长度。
 *   - a[i-1]===b[j-1]：dp[i][j] = dp[i-1][j-1]+1
 *   - 否则：dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 * 回溯：从 (n,m) 倒推——
 *   - 字符相等：放入一个，i--, j--（来自 both）
 *   - 否则 dp[i-1][j] > dp[i][j-1]：放入 a[i-1]，i--（来自 a）
 *   - 否则放入 b[j-1]，j--（来自 b）
 *
 * 时间 O(n·m)，空间 O(n·m)。
 *
 * @returns { length, superseq }
 */
export function shortestCommonSuperseq(
  a: string,
  b: string,
  hooks: ScsHooks = {},
): { length: number; superseq: string } {
  const n = a.length;
  const m = b.length;
  if (n === 0 && m === 0) {
    hooks.onDone?.(0, '');
    return { length: 0, superseq: '' };
  }
  if (n === 0) {
    const r = { length: m, superseq: b };
    hooks.onDone?.(m, b);
    return r;
  }
  if (m === 0) {
    const r = { length: n, superseq: a };
    hooks.onDone?.(n, a);
    return r;
  }

  // 1) LCS 长度矩阵
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) dp[i]![j] = dp[i - 1]![j - 1]! + 1;
      else dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
      hooks.onCell?.(i, j, dp[i]![j]!);
    }
  }

  // 2) 回溯构造
  const rev: string[] = [];
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      rev.push(a[i - 1]!);
      hooks.onBacktrack?.(i, j, a[i - 1]!, 'both');
      i--;
      j--;
    } else if (dp[i - 1]![j]! > dp[i]![j - 1]!) {
      rev.push(a[i - 1]!);
      hooks.onBacktrack?.(i, j, a[i - 1]!, 'a');
      i--;
    } else {
      rev.push(b[j - 1]!);
      hooks.onBacktrack?.(i, j, b[j - 1]!, 'b');
      j--;
    }
  }
  while (i > 0) {
    rev.push(a[i - 1]!);
    hooks.onBacktrack?.(i, j, a[i - 1]!, 'a');
    i--;
  }
  while (j > 0) {
    rev.push(b[j - 1]!);
    hooks.onBacktrack?.(i, j, b[j - 1]!, 'b');
    j--;
  }

  const superseq = rev.reverse().join('');
  hooks.onDone?.(superseq.length, superseq);
  return { length: superseq.length, superseq };
}
