// NAdam · 实现
export interface NadamHooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface NadamResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}
export function optNadam2(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: {
    lr?: number;
    beta1?: number;
    beta2?: number;
    eps?: number;
    maxIter?: number;
    tol?: number;
  } = {},
  hooks: NadamHooks = {},
): NadamResult {
  const { lr = 0.1, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    const bc1 = 1 - Math.pow(beta1, it);
    const bc2 = 1 - Math.pow(beta2, it);
    for (let i = 0; i < params.length; i++) {
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
      const mHat = m[i]! / bc1 + ((1 - beta1) * g[i]!) / bc1;
      const vHat = v[i]! / bc2;
      params[i]! -= (lr * mHat) / (Math.sqrt(vHat) + eps);
    }
    hooks.onIter?.(it, [...params], value);
    iterations = it;
    if (gn < tol) {
      converged = true;
      break;
    }
  }
  return { params, value: f(params), iterations, converged };
}
/** 演示目标 f(x,y) = (x-3)^2 + (y+1)^2，最优解 (3,-1)。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}
/** 演示梯度 ∇f = [2(x-3), 2(y+1)]。 */
export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 3), 2 * (p[1]! + 1)];
}
