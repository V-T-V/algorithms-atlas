// =============================================================================
// 回溯线搜索（Armijo）· 纯算法实现
// =============================================================================

export type Vec = number[];

export interface BacktrackResult {
  alpha: number;
  fnew: number;
  xnew: Vec;
  iterations: number;
  accepted: boolean;
}

export interface BacktrackHooks {
  onTrial?: (iter: number, alpha: number, fnew: number, armijo: boolean) => void;
  onResult?: (r: BacktrackResult) => void;
}

const dot = (a: Vec, b: Vec): number => a.reduce((s, v, i) => s + v * b[i]!, 0);
const add = (a: Vec, b: Vec): Vec => a.map((v, i) => v + b[i]!);
const scale = (a: Vec, s: number): Vec => a.map((v) => v * s);

/**
 * 回溯线搜索。
 *
 * @param f 目标函数
 * @param x 当前点
 * @param fx f(x)
 * @param g 梯度
 * @param p 下降方向（应满足 pᵀg<0）
 * @param options alpha0、rho、c、maxIter
 * @param hooks 可选钩子
 */
export function backtrackLineSearch(
  f: (x: Vec) => number,
  x: Vec,
  fx: number,
  g: Vec,
  p: Vec,
  options: { alpha0?: number; rho?: number; c?: number; maxIter?: number } = {},
  hooks: BacktrackHooks = {},
): BacktrackResult {
  const { alpha0 = 1, rho = 0.5, c = 1e-4, maxIter = 40 } = options;
  const pg = dot(g, p);
  let alpha = alpha0;
  let iterations = 0;
  for (let i = 0; i < maxIter; i++) {
    iterations = i + 1;
    const xnew = add(x, scale(p, alpha));
    const fnew = f(xnew);
    const armijo = fnew <= fx + c * alpha * pg;
    hooks.onTrial?.(i + 1, alpha, fnew, armijo);
    if (armijo) {
      const result: BacktrackResult = { alpha, fnew, xnew, iterations, accepted: true };
      hooks.onResult?.(result);
      return result;
    }
    alpha *= rho;
  }
  const xnew = add(x, scale(p, alpha));
  const result: BacktrackResult = { alpha, fnew: f(xnew), xnew, iterations, accepted: false };
  hooks.onResult?.(result);
  return result;
}

/**
 * 用回溯线搜索驱动的最速下降演示。
 */
export interface SteepestDescentResult {
  x: Vec;
  value: number;
  iterations: number;
  converged: boolean;
}

export interface SteepestDescentHooks {
  onIter?: (iter: number, x: Vec, value: number, alpha: number) => void;
}

export function steepestDescentBacktrack(
  f: (x: Vec) => number,
  grad: (x: Vec) => Vec,
  x0: Vec,
  options: { maxIter?: number; tol?: number; c?: number; rho?: number } = {},
  hooks: SteepestDescentHooks = {},
): SteepestDescentResult {
  const { maxIter = 200, tol = 1e-8, c = 1e-4, rho = 0.5 } = options;
  const x = [...x0];
  let fx = f(x);
  let iterations = 0;
  let converged = false;
  for (let k = 1; k <= maxIter; k++) {
    iterations = k;
    const g = grad(x);
    const gnorm = Math.sqrt(dot(g, g));
    if (gnorm < tol) {
      converged = true;
      break;
    }
    const p = scale(g, -1);
    const ls = backtrackLineSearch(f, x, fx, g, p, { c, rho });
    x.forEach((_, i) => (x[i] = ls.xnew[i]!));
    fx = ls.fnew;
    hooks.onIter?.(k, [...x], fx, ls.alpha);
  }
  return { x, value: fx, iterations, converged };
}
