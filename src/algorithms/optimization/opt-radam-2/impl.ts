// RAdam · 实现
export interface RadamHooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface RadamResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}
export function optRadam2(
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
  hooks: RadamHooks = {},
): RadamResult {
  const { lr = 0.1, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  const rhoInf = 2 / (1 - beta2) - 1;
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    const bc2 = 1 - Math.pow(beta2, it);
    const bc1 = 1 - Math.pow(beta1, it);
    const rho = rhoInf - (2 * it * bc2) / (1 - Math.pow(beta2, it));
    for (let i = 0; i < params.length; i++) {
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
      if (rho > 4) {
        const r = Math.sqrt(((rho - 4) * (rho - 2) * rhoInf) / ((rhoInf - 4) * (rhoInf - 2) * rho));
        const mHat = m[i]! / bc1;
        const vHat = v[i]! / bc2;
        params[i]! -= (lr * r * mHat) / (Math.sqrt(vHat) + eps);
      } else {
        params[i]! -= lr * (m[i]! / bc1);
      }
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
