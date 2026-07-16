// =============================================================================
// 矩阵连乘 Matrix Chain Multiplication · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// 给定 n 个矩阵的维度 p[0..n]（矩阵 i 的维度为 p[i-1] × p[i]），
// 求最少标量乘法次数及最优括号化方案。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MatrixChainHooks {
  /** 尝试用 k 作为断点合并区间 [i..j]，cost 为该断点下的乘法次数。 */
  onTrySplit?: (i: number, j: number, k: number, cost: number) => void;
  /** 确定 dp[i][j] = minCost，最佳断点 bestK。 */
  onSetBest?: (i: number, j: number, minCost: number, bestK: number) => void;
  /** 回溯经过的最优断点 (i, k, j)。 */
  onBacktrack?: (i: number, k: number, j: number) => void;
}

/** 结果：最少乘法次数与括号化字符串。 */
export interface MatrixChainResult {
  cost: number;
  parenthesization: string;
}

/**
 * 矩阵连乘最优括号化。
 *
 * 状态：`dp[i][j]` = 计算矩阵 `A_i × ... × A_j`（下标从 1 计）的最少乘法次数。
 *   - `dp[i][i] = 0`（单矩阵无需乘）
 *   - `dp[i][j] = min_{i<=k<j} { dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j] }`
 *   - 同时记录断点 `s[i][j] = argmin k` 用于回溯括号化。
 *
 * @param dims 维度数组 p[0..n]，长度 n+1；矩阵 i 维度为 p[i-1] × p[i]。
 * @returns { cost, parenthesization }
 */
export function matrixChain(
  dims: readonly number[],
  hooks: MatrixChainHooks = {},
): MatrixChainResult {
  const n = dims.length - 1; // 矩阵个数
  if (n <= 0) return { cost: 0, parenthesization: '' };
  if (n === 1) return { cost: 0, parenthesization: 'A1' };

  // dp / s 都是 (n+1) x (n+1)，下标 1..n
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  const s: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));

  // len 为区间长度，从 2 开始
  for (let len = 2; len <= n; len++) {
    for (let i = 1; i + len - 1 <= n; i++) {
      const j = i + len - 1;
      dp[i]![j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i]![k]! + dp[k + 1]![j]! + dims[i - 1]! * dims[k]! * dims[j]!;
        hooks.onTrySplit?.(i, j, k, cost);
        if (cost < dp[i]![j]!) {
          dp[i]![j] = cost;
          s[i]![j] = k;
        }
      }
      hooks.onSetBest?.(i, j, dp[i]![j]!, s[i]![j]!);
    }
  }

  // 回溯括号化
  const build = (i: number, j: number): string => {
    if (i === j) return `A${i}`;
    const k = s[i]![j]!;
    hooks.onBacktrack?.(i, k, j);
    return `(${build(i, k)} × ${build(k + 1, j)})`;
  };
  const parenthesization = build(1, n);

  return { cost: dp[1]![n]!, parenthesization };
}
