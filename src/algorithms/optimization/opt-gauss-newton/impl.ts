// =============================================================================
// 高斯-牛顿法 · 纯算法实现
// 解正规方程 (JᵀJ)·Δx = −Jᵀr；用于非线性最小二乘。
// =============================================================================

export type Mat = number[][];
export type Vec = number[];

export interface GaussNewtonResult {
  x: Vec;
  residual: number; // ½||r||²
  iterations: number;
  converged: boolean;
}

export interface GaussNewtonHooks {
  onIter?: (iter: number, x: Vec, residual: number) => void;
  onResult?: (r: GaussNewtonResult) => void;
}

const dot = (a: Vec, b: Vec): number => a.reduce((s, v, i) => s + v * b[i]!, 0);
const norm = (a: Vec): number => Math.sqrt(dot(a, a));

/** 用高斯消元解 A·x = b（小矩阵，带部分主元）。 */
export function solveLinear(A: Mat, b: Vec): Vec {
  const n = A.length;
  const M: Mat = A.map((row, i) => [...row, b[i]!]);
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k]![i]!) > Math.abs(M[pivot]![i]!)) pivot = k;
    }
    const rowI = M[i]!;
    const rowP = M[pivot]!;
    M[i] = rowP;
    M[pivot] = rowI;
    const piv = M[i]![i]!;
    if (Math.abs(piv) < 1e-14) continue; // 奇异跳过
    for (let j = i; j <= n; j++) M[i]![j] = M[i]![j]! / piv;
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = M[k]![i]!;
      for (let j = i; j <= n; j++) M[k]![j] = M[k]![j]! - factor * M[i]![j]!;
    }
  }
  return M.map((row) => row[n]!);
}

/**
 * 高斯-牛顿法。
 *
 * @param residual 残差函数 r(x)：Vec
 * @param jacobian 雅可比 J(x)：Mat（m×n）
 * @param x0 初始参数
 * @param options maxIter、tol
 * @param hooks 可选钩子
 */
export function gaussNewton(
  residual: (x: Vec) => Vec,
  jacobian: (x: Vec) => Mat,
  x0: Vec,
  options: { maxIter?: number; tol?: number } = {},
  hooks: GaussNewtonHooks = {},
): GaussNewtonResult {
  const { maxIter = 100, tol = 1e-10 } = options;
  const n = x0.length;
  const x = [...x0];
  let r = residual(x);
  let cost = 0.5 * dot(r, r);
  let iterations = 0;
  let converged = false;
  for (let k = 1; k <= maxIter; k++) {
    iterations = k;
    const J = jacobian(x);
    // 正规方程：A = JᵀJ，b = −Jᵀr
    const A: Mat = Array.from({ length: n }, () => new Array<number>(n).fill(0));
    const b: Vec = new Array<number>(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let s = 0;
        for (let row = 0; row < J.length; row++) s += J[row]![i]! * J[row]![j]!;
        A[i]![j] = s;
      }
      let sb = 0;
      for (let row = 0; row < J.length; row++) sb -= J[row]![i]! * r[row]!;
      b[i] = sb;
    }
    const dx = solveLinear(A, b);
    x.forEach((_, i) => (x[i] = x[i]! + dx[i]!));
    r = residual(x);
    cost = 0.5 * dot(r, r);
    hooks.onIter?.(k, [...x], cost);
    if (norm(dx) < tol) {
      converged = true;
      break;
    }
  }
  const result: GaussNewtonResult = { x, residual: cost, iterations, converged };
  hooks.onResult?.(result);
  return result;
}
