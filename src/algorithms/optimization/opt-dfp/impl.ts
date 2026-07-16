// =============================================================================
// DFP 拟牛顿法 · 纯算法实现
// 维护海森逆近似 H，DFP 秩二更新 + Armijo 线搜索。
// =============================================================================

export interface DFPResult {
  x: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

export interface DFPHooks {
  onIter?: (iter: number, x: number[], grad: number[], value: number, step: number) => void;
  onUpdate?: (s: number[], y: number[]) => void;
  onResult?: (r: DFPResult) => void;
}

// —— 线性代数助手（仅矩阵-向量与秩二更新，避免引入依赖）——
type Mat = number[][];
const identity = (n: number): Mat =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
const matVec = (M: Mat, v: number[]): number[] =>
  M.map((row) => row.reduce((s, m, j) => s + m * v[j]!, 0));
const dot = (a: number[], b: number[]): number => a.reduce((s, v, i) => s + v * b[i]!, 0);
const norm = (a: number[]): number => Math.sqrt(dot(a, a));
const sub = (a: number[], b: number[]): number[] => a.map((v, i) => v - b[i]!);
const add = (a: number[], b: number[]): number[] => a.map((v, i) => v + b[i]!);
const scale = (a: number[], s: number): number[] => a.map((v) => v * s);

/**
 * DFP 秩二更新 H（原地修改）。
 * H ← H − (H y yᵀ H)/(yᵀ H y) + (s sᵀ)/(yᵀ s)
 */
export function dfpUpdate(H: Mat, s: number[], y: number[]): void {
  const n = H.length;
  const Hy = matVec(H, y);
  const yHy = dot(y, Hy);
  const ys = dot(y, s);
  if (Math.abs(yHy) < 1e-14 || Math.abs(ys) < 1e-14) return;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      H[i]![j] = H[i]![j]! - (Hy[i]! * Hy[j]!) / yHy + (s[i]! * s[j]!) / ys;
    }
  }
}

function lineSearch(
  f: (x: number[]) => number,
  x: number[],
  fx: number,
  gx: number[],
  p: number[],
  alpha0 = 1,
  beta = 0.5,
  c1 = 1e-4,
): { alpha: number; fnew: number; xnew: number[] } {
  const pg = dot(gx, p);
  let alpha = alpha0;
  for (let i = 0; i < 40; i++) {
    const xnew = add(x, scale(p, alpha));
    const fnew = f(xnew);
    if (fnew <= fx + c1 * alpha * pg) return { alpha, fnew, xnew };
    alpha *= beta;
  }
  const xnew = add(x, scale(p, alpha));
  return { alpha, fnew: f(xnew), xnew };
}

/**
 * DFP 拟牛顿法。
 *
 * @param f 目标函数
 * @param grad 梯度
 * @param x0 初始点
 * @param options maxIter、tol
 * @param hooks 可选钩子
 */
export function dfp(
  f: (x: number[]) => number,
  grad: (x: number[]) => number[],
  x0: number[],
  options: { maxIter?: number; tol?: number } = {},
  hooks: DFPHooks = {},
): DFPResult {
  const { maxIter = 200, tol = 1e-10 } = options;
  const n = x0.length;
  const x = [...x0];
  const H = identity(n);
  let gx = grad(x);
  let fx = f(x);
  let iterations = 0;
  let converged = false;
  for (let k = 1; k <= maxIter; k++) {
    iterations = k;
    if (norm(gx) < tol) {
      converged = true;
      break;
    }
    // 搜索方向 p = -H·g
    const p = scale(matVec(H, gx), -1);
    // 非下降则重置 H
    let dir = p;
    if (dot(p, gx) >= 0) {
      dir = scale(gx, -1);
    }
    const { alpha, fnew, xnew } = lineSearch(f, x, fx, gx, dir);
    const gnew = grad(xnew);
    const s = sub(xnew, x);
    const y = sub(gnew, gx);
    dfpUpdate(H, s, y);
    hooks.onUpdate?.(s, y);
    x.forEach((_, i) => (x[i] = xnew[i]!));
    fx = fnew;
    gx = gnew;
    hooks.onIter?.(k, [...x], [...gx], fx, alpha);
  }
  const result: DFPResult = { x, value: fx, iterations, converged };
  hooks.onResult?.(result);
  return result;
}
