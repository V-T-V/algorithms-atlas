// =============================================================================
// 编辑距离 Edit Distance (Levenshtein) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// 状态：dp[i][j] = 把 a[0..i) 变成 b[0..j) 所需的最少操作数（插入/删除/替换）。
// =============================================================================

/** 单元格取值来源。 */
export type EditFrom = 'match' | 'replace' | 'insert' | 'delete';

/** 算法执行过程中的事件钩子。任一可选。 */
export interface EditDistanceHooks {
  /** 填好 dp[i][j]。from 说明本格取值的转移方向。 */
  onFillCell?: (i: number, j: number, val: number, from: EditFrom) => void;
  /** 回溯经过单元格 (i,j)，op 为对应的编辑操作（用于还原一条最优编辑序列）。 */
  onBacktrack?: (i: number, j: number, op: 'match' | 'replace' | 'insert' | 'delete') => void;
}

/**
 * 编辑距离（Levenshtein Distance）。
 *
 * 状态：`dp[i][j]` = 把 `a[0..i)` 变成 `b[0..j)` 的最少操作数。
 * 转移：
 *   - `dp[0][j] = j`（全插入）；`dp[i][0] = i`（全删除）
 *   - 若 `a[i-1] === b[j-1]`：`dp[i][j] = dp[i-1][j-1]`（字符相同，免操作，记 match）
 *   - 否则：`dp[i][j] = 1 + min( dp[i-1][j-1] 替换, dp[i-1][j] 删除, dp[i][j-1] 插入 )`
 *
 * @returns 最少操作数。任一为空返回另一串长度。
 */
export function editDistance(a: string, b: string, hooks: EditDistanceHooks = {}): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  // dp 大小 (m+1) x (n+1)
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  // 边界
  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
        hooks.onFillCell?.(i, j, dp[i]![j]!, 'match');
      } else {
        const replace = dp[i - 1]![j - 1]!;
        const del = dp[i - 1]![j]!;
        const ins = dp[i]![j - 1]!;
        const best = Math.min(replace, del, ins);
        let from: EditFrom;
        if (best === replace) from = 'replace';
        else if (best === del) from = 'delete';
        else from = 'insert';
        dp[i]![j] = best + 1;
        hooks.onFillCell?.(i, j, dp[i]![j]!, from);
      }
    }
  }

  // 回溯还原一条最优操作序列
  let i = m;
  let j = n;
  const path: Array<{ i: number; j: number; op: 'match' | 'replace' | 'insert' | 'delete' }> = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      path.push({ i, j, op: 'match' });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i]![j] === dp[i - 1]![j - 1]! + 1) {
      path.push({ i, j, op: 'replace' });
      i--;
      j--;
    } else if (i > 0 && dp[i]![j] === dp[i - 1]![j]! + 1) {
      path.push({ i, j, op: 'delete' });
      i--;
    } else {
      path.push({ i, j, op: 'insert' });
      j--;
    }
  }
  for (const p of path) hooks.onBacktrack?.(p.i, p.j, p.op);

  return dp[m]![n]!;
}
