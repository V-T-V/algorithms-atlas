// =============================================================================
// Damerau-Levenshtein 距离 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DamerauHooks {
  /** 填写 dp[i][j] = cost。 */
  onCell?: (i: number, j: number, cost: number) => void;
  /** 当前格来源：插入/删除/替换(匹配)/相邻交换。 */
  onSource?: (i: number, j: number, op: 'insert' | 'delete' | 'replace' | 'match' | 'swap') => void;
  /** 计算完成，给出最终距离。 */
  onDone?: (distance: number) => void;
}

/**
 * Damerau-Levenshtein 距离：在莱文斯坦距离基础上，允许「相邻两字符交换」作为一次编辑。
 *
 * - `dp[i][j]` = `a[0..i-1]` 与 `b[0..j-1]` 的距离
 * - 边界 `dp[i][0]=i`、`dp[0][j]=j`
 * - 先取 `min(删+1, 插+1, 替换/匹配)`
 * - 若 `i≥2 && j≥2 && a[i-1]=b[j-2] && a[i-2]=b[j-1]`，再考虑 `dp[i-2][j-2]+1`（一次相邻交换）
 *
 * 时间 `O(n·m)`，空间 `O(n·m)`（返回完整矩阵）。
 *
 * @returns 距离矩阵 `dp`，`dp[la][lb]` 为最终距离
 */
export function damerau(a: string, b: string, hooks: DamerauHooks = {}): number[][] {
  const la = a.length;
  const lb = b.length;
  const dp: number[][] = Array.from({ length: la + 1 }, () => new Array<number>(lb + 1).fill(0));

  for (let i = 0; i <= la; i++) dp[i]![0] = i;
  for (let j = 0; j <= lb; j++) dp[0]![j] = j;

  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const del = dp[i - 1]![j]! + 1;
      const ins = dp[i]![j - 1]! + 1;
      const rep = dp[i - 1]![j - 1]! + cost;
      let best = Math.min(del, ins, rep);
      let op: 'insert' | 'delete' | 'replace' | 'match' | 'swap';
      if (best === rep) op = cost === 0 ? 'match' : 'replace';
      else if (best === ins) op = 'insert';
      else op = 'delete';

      // 相邻交换：a[i-2..i-1] 与 b[j-2..j-1] 互为反转
      if (i >= 2 && j >= 2 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        const sw = dp[i - 2]![j - 2]! + 1;
        if (sw < best) {
          best = sw;
          op = 'swap';
        }
      }
      dp[i]![j] = best;
      hooks.onSource?.(i, j, op);
      hooks.onCell?.(i, j, best);
    }
  }
  hooks.onDone?.(dp[la]![lb]!);
  return dp;
}
