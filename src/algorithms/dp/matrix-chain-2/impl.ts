// =============================================================================
// 矩阵链DP2（Matrix Chain Multiplication）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 给定 n 个矩阵的维度序列 p[0..n]（第 i 个矩阵为 p[i-1] x p[i]），
// 求把全部相乘的最少标量乘法次数。经典区间 DP，O(n^3)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MatrixChain2Hooks {
  /** 处理区间 [i, j]：枚举断点 k 得到候选代价 val。 */
  onTry?: (i: number, j: number, k: number, val: number) => void;
  /** 确定 dp[i][j] 与最优断点 opt。 */
  onFill?: (i: number, j: number, val: number, opt: number) => void;
}

/**
 * 矩阵链乘法：给定维度序列 `dims`（长度 n+1，第 i 个矩阵为 `dims[i-1] x dims[i]`），
 * 求把全部矩阵按给定顺序相乘的最少标量乘法次数。
 *
 * 状态：`dp[i][j]` = 把第 i..j 个矩阵（1-based）相乘的最小代价。
 * 转移：`dp[i][j] = min_{i<=k<j} ( dp[i][k] + dp[k+1][j] + dims[i-1]*dims[k]*dims[j] )`
 * 单矩阵 `dp[i][i] = 0`。答案 = `dp[1][n]`。
 *
 * @param dims 维度序列 p[0..n]（长度 >= 2）
 * @param hooks 可选事件钩子
 * @returns 最少标量乘法次数；矩阵数 < 1 返回 0。
 */
export function matrixChain2(dims: readonly number[], hooks: MatrixChain2Hooks = {}): number {
  const n = dims.length - 1; // 矩阵个数
  if (n <= 1) return 0;
  // dp 使用 1..n 索引；为简化用 (n+1) x (n+1)，下标从 1 开始
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  // 按区间长度递增
  for (let len = 2; len <= n; len++) {
    for (let i = 1; i + len - 1 <= n; i++) {
      const j = i + len - 1;
      let best = Infinity;
      let bestK = i;
      for (let k = i; k < j; k++) {
        const val = dp[i]![k]! + dp[k + 1]![j]! + dims[i - 1]! * dims[k]! * dims[j]!;
        hooks.onTry?.(i, j, k, val);
        if (val < best) {
          best = val;
          bestK = k;
        }
      }
      dp[i]![j] = best;
      hooks.onFill?.(i, j, best, bestK);
    }
  }
  return dp[1]![n]!;
}
