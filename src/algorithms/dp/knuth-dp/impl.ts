// =============================================================================
// 四边形不等式DP（Knuth Optimization）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典应用：石子合并（合并相邻两堆，代价为两堆之和，求最小总代价）。
//   满足四边形不等式 → 最优决策点 K[i][j-1] <= K[i][j] <= K[i+1][j]，
//   把区间 DP 的 O(n^3) 降到 O(n^2)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface KnuthDpHooks {
  /** 处理区间 [i, j]：决策点搜索范围 [ki, kj]。 */
  onSolve?: (i: number, j: number, ki: number, kj: number) => void;
  /** 枚举断点 k，得到候选代价 val。 */
  onTry?: (i: number, j: number, k: number, val: number) => void;
  /** 确定 dp[i][j] 与最优断点 opt。 */
  onFill?: (i: number, j: number, val: number, opt: number) => void;
}

/**
 * Knuth 优化的石子合并：n 堆石子排成一行，每次只能合并**相邻**两堆，
 * 代价为两堆石子数之和，求把所有石子合并成一堆的最小总代价。
 *
 * 状态：`dp[i][j]` = 把第 i..j 堆合并成一堆的最小代价。
 * 转移：`dp[i][j] = min_{i<=k<j} ( dp[i][k] + dp[k+1][j] ) + sum(i, j)`
 *   其中 `sum(i, j)` 为第 i..j 堆的石子总数（前缀和 O(1)）。
 * Knuth 优化：`K[i][j-1] <= K[i][j] <= K[i+1][j]`，断点搜索区间大幅缩减。
 *
 * @param stones 各堆石子数（非负）
 * @param hooks 可选事件钩子
 * @returns 最小合并总代价。
 */
export function knuthDp(stones: readonly number[], hooks: KnuthDpHooks = {}): number {
  const n = stones.length;
  if (n <= 1) return 0;
  // 前缀和 sum(i,j) = pref[j+1] - pref[i]
  const pref = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) pref[i + 1] = pref[i]! + stones[i]!;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const K: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  // 长度 1：dp[i][i] = 0，断点 = i
  for (let i = 0; i < n; i++) K[i]![i] = i;

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      const ki = K[i]![j - 1]!;
      const kj = K[i + 1]![j]!;
      hooks.onSolve?.(i, j, ki, kj);
      let best = Infinity;
      let bestK = ki;
      const segSum = pref[j + 1]! - pref[i]!;
      for (let k = ki; k <= kj && k < j; k++) {
        const val = dp[i]![k]! + dp[k + 1]![j]! + segSum;
        hooks.onTry?.(i, j, k, val);
        if (val < best) {
          best = val;
          bestK = k;
        }
      }
      dp[i]![j] = best;
      K[i]![j] = bestK;
      hooks.onFill?.(i, j, best, bestK);
    }
  }
  return dp[0]![n - 1]!;
}
