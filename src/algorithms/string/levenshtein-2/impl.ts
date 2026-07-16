// =============================================================================
// 莱文斯坦距离（DP 全矩阵）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Levenshtein2Hooks {
  /** 填写 dp[i][j] = cost。 */
  onCell?: (i: number, j: number, cost: number) => void;
  /** 选定 dp[i][j] 来自「插入 / 删除 / 替换(或匹配)」中的最优来源。 */
  onSource?: (i: number, j: number, op: 'insert' | 'delete' | 'replace' | 'match') => void;
  /** 计算完成，给出最终距离。 */
  onDone?: (distance: number) => void;
}

/**
 * 莱文斯坦距离（全矩阵 DP）：把 `a` 变成 `b` 所需的最少单字符编辑（插入/删除/替换）次数。
 *
 * - `dp[i][j]` = `a[0..i-1]` 与 `b[0..j-1]` 的距离
 * - 边界 `dp[0][j]=j`、`dp[i][0]=i`
 * - `dp[i][j] = min( dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1] + (a[i-1]!=b[j-1]?1:0) )`
 *
 * 时间 `O(n·m)`，空间 `O(n·m)`（返回完整矩阵，供回溯/可视化）。
 *
 * @returns 距离矩阵 `dp`，`dp[la][lb]` 为最终距离
 */
export function levenshtein2(a: string, b: string, hooks: Levenshtein2Hooks = {}): number[][] {
  const la = a.length;
  const lb = b.length;
  const dp: number[][] = Array.from({ length: la + 1 }, () => new Array<number>(lb + 1).fill(0));

  for (let i = 0; i <= la; i++) dp[i]![0] = i;
  for (let j = 0; j <= lb; j++) dp[0]![j] = j;

  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const del = dp[i - 1]![j]! + 1; // 删除 a[i-1]
      const ins = dp[i]![j - 1]! + 1; // 插入 b[j-1]
      const rep = dp[i - 1]![j - 1]! + cost; // 替换/匹配
      const best = Math.min(del, ins, rep);
      dp[i]![j] = best;
      let op: 'insert' | 'delete' | 'replace' | 'match';
      if (best === rep) op = cost === 0 ? 'match' : 'replace';
      else if (best === ins) op = 'insert';
      else op = 'delete';
      hooks.onSource?.(i, j, op);
      hooks.onCell?.(i, j, best);
    }
  }
  hooks.onDone?.(dp[la]![lb]!);
  return dp;
}
