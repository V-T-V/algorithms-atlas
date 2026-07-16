// =============================================================================
// 松弛 Gauss-Seidel (SOR) · 纯算法实现
// 解 A x = b：x_i ← x_i + ω·((b_i - Σ a_ij x_j)/a_ii)
// =============================================================================

export interface SorHooks {
  onIter?: (iter: number, x: number[], residual: number) => void;
}

export interface SorResult {
  x: number[];
  iterations: number;
  converged: boolean;
}

/**
 * SOR 求解线性方程组 Ax = b。
 * @param A 系数矩阵（n×n），要求对角占优或正定
 * @param b 右端向量
 * @param omega 松弛因子 (0,2)，1 = Gauss-Seidel
 * @param maxIter 最大迭代次数
 * @param tol 收敛阈值（残差无穷范数）
 */
export function sor(
  A: number[][],
  b: number[],
  omega: number,
  maxIter = 1000,
  tol = 1e-10,
  hooks: SorHooks = {},
): SorResult {
  const n = b.length;
  const x = new Array<number>(n).fill(0);
  let converged = false;
  let iter = 0;
  for (iter = 1; iter <= maxIter; iter++) {
    let maxResidual = 0;
    for (let i = 0; i < n; i++) {
      const row = A[i]!;
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) sum += row[j]! * x[j]!;
      }
      const aii = row[i]!;
      if (Math.abs(aii) < 1e-300) throw new Error(`零对角元 A[${i}][${i}]`);
      const gs = (b[i]! - sum) / aii;
      const newX = x[i]! + omega * (gs - x[i]!);
      const residual = Math.abs(newX - x[i]!);
      if (residual > maxResidual) maxResidual = residual;
      x[i] = newX;
    }
    hooks.onIter?.(iter, [...x], maxResidual);
    if (maxResidual < tol) {
      converged = true;
      break;
    }
  }
  return { x, iterations: iter, converged };
}
