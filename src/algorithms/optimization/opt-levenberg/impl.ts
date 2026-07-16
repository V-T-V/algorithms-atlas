// =============================================================================
// Levenberg-Marquardt · 纯算法实现
// 自适应阻尼：远 → 最速下降；近 → 高斯-牛顿。
// =============================================================================

export type Mat = number[][];
export type Vec = number[];

export interface LMResult {
  x: Vec;
  residual: number;
  iterations: number;
  converged: boolean;
  lambda: number;
}

export interface LMHooks {
  onIter?: (iter: number, x: Vec, residual: number, lambda: number, accepted: boolean) => void;
  onResult?: (r: LMResult) => void;
}

const dot = (a: Vec, b: Vec): number => a.reduce((s, v, i) => s + v * b[i]!, 0);
const norm = (a: Vec): number => Math.sqrt(dot(a, a));

/** 高斯消元解 A·x=b。 */
function solveLinear(A: Mat, b: Vec): Vec {
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
    if (Math.abs(piv) < 1e-14) continue;
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
 * Levenberg-Marquardt。
 *
 * @param residual 残差函数
 * @param jacobian 雅可比函数
 * @param x0 初始参数
 * @param options maxIter、tol、initLambda
 * @param hooks 可选钩子
 */
export function levenbergMarquardt(
  residual: (x: Vec) => Vec,
  jacobian: (x: Vec) => Mat,
  x0: Vec,
  options: { maxIter?: number; tol?: number; initLambda?: number } = {},
  hooks: LMHooks = {},
): LMResult {
  const { maxIter = 100, tol = 1e-10, initLambda = 1e-3 } = options;
  const n = x0.length;
  const x = [...x0];
  let lambda = initLambda;
  let r = residual(x);
  let cost = 0.5 * dot(r, r);
  let iterations = 0;
  let converged = false;
  for (let k = 1; k <= maxIter; k++) {
    iterations = k;
    const J = jacobian(x);
    // A = JᵀJ，g = Jᵀr
    const A: Mat = Array.from({ length: n }, () => new Array<number>(n).fill(0));
    const g: Vec = new Array<number>(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let s = 0;
        for (let row = 0; row < J.length; row++) s += J[row]![i]! * J[row]![j]!;
        A[i]![j] = s;
      }
      let sg = 0;
      for (let row = 0; row < J.length; row++) sg += J[row]![i]! * r[row]!;
      g[i] = sg;
    }
    // 加阻尼：A + λ·diag(A)
    const Adamp: Mat = A.map((row, i) =>
      row.map((v, j) => (i === j ? v + lambda * (A[i]![i]! || 1) : v)),
    );
    const dx = solveLinear(
      Adamp,
      g.map((v) => -v),
    );
    const xnew = x.map((v, i) => v + dx[i]!);
    const rnew = residual(xnew);
    const costNew = 0.5 * dot(rnew, rnew);
    const accepted = costNew < cost;
    if (accepted) {
      x.forEach((_, i) => (x[i] = xnew[i]!));
      r = rnew;
      cost = costNew;
      lambda = Math.max(lambda * 0.5, 1e-12);
    } else {
      lambda = Math.min(lambda * 2, 1e12);
    }
    hooks.onIter?.(k, [...x], cost, lambda, accepted);
    if (accepted && norm(dx) < tol) {
      converged = true;
      break;
    }
  }
  const result: LMResult = { x, residual: cost, iterations, converged, lambda };
  hooks.onResult?.(result);
  return result;
}
