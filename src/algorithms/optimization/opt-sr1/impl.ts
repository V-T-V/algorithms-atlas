// =============================================================================
// SR1 对称秩一更新 · 纯算法实现
// H ← H + v vᵀ / (vᵀ y)，其中 v = s − H y。
// =============================================================================

export type Mat = number[][];

export interface SR1Result {
  x: number[];
  value: number;
  iterations: number;
  converged: boolean;
}

export interface SR1Hooks {
  onIter?: (iter: number, x: number[], grad: number[], value: number, step: number) => void;
  onUpdate?: (v: number[], vy: number) => void;
  onResult?: (r: SR1Result) => void;
}

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
 * SR1 秩一更新 H（原地修改）。
 * 跳过条件：|vᵀ y| < ε |y|²，避免数值爆炸。
 */
export function sr1Update(H: Mat, s: number[], y: number[], skipEpsilon = 1e-8): boolean {
  const n = H.length;
  const Hy = matVec(H, y);
  const v = sub(s, Hy); // v = s - H y
  const vy = dot(v, y);
  const yy = dot(y, y);
  if (Math.abs(vy) < skipEpsilon * Math.max(1, yy)) return false; // 跳过
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      H[i]![j] = H[i]![j]! + (v[i]! * v[j]!) / vy;
    }
  }
  return true;
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
    if (pg < 0 && fnew <= fx + c1 * alpha * pg) return { alpha, fnew, xnew };
    alpha *= beta;
  }
  const xnew = add(x, scale(p, alpha));
  return { alpha, fnew: f(xnew), xnew };
}

/**
 * SR1 拟牛顿（带线搜索；方向非下降时退化为最速下降）。
 */
export function sr1(
  f: (x: number[]) => number,
  grad: (x: number[]) => number[],
  x0: number[],
  options: { maxIter?: number; tol?: number } = {},
  hooks: SR1Hooks = {},
): SR1Result {
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
    const pH = scale(matVec(H, gx), -1);
    // SR1 不保正定，方向可能非下降；非下降时用最速下降
    let dir: number[];
    if (dot(pH, gx) < 0) dir = pH;
    else dir = scale(gx, -1);
    const { alpha, fnew, xnew } = lineSearch(f, x, fx, gx, dir);
    const gnew = grad(xnew);
    const s = sub(xnew, x);
    const y = sub(gnew, gx);
    const v = sub(s, matVec(H, y));
    const vy = dot(v, y);
    const updated = sr1Update(H, s, y);
    if (updated) hooks.onUpdate?.(v, vy);
    x.forEach((_, i) => (x[i] = xnew[i]!));
    fx = fnew;
    gx = gnew;
    hooks.onIter?.(k, [...x], [...gx], fx, alpha);
  }
  const result: SR1Result = { x, value: fx, iterations, converged };
  hooks.onResult?.(result);
  return result;
}
