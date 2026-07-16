// PyTorch SGD · 实现
export interface TorchSgdHooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface TorchSgdResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}
export function optTorchSgd(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: {
    lr?: number;
    momentum?: number;
    dampening?: number;
    nesterov?: boolean;
    wd?: number;
    maxIter?: number;
    tol?: number;
  } = {},
  hooks: TorchSgdHooks = {},
): TorchSgdResult {
  const {
    lr = 0.1,
    momentum = 0.9,
    dampening = 0,
    nesterov = false,
    wd = 0,
    maxIter = 500,
    tol = 1e-8,
  } = opts;
  const params = [...init];
  const v = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    for (let i = 0; i < params.length; i++) {
      const gi = g[i]! + wd * params[i]!;
      v[i] = momentum * v[i]! + (1 - dampening) * gi;
      const upd = nesterov ? gi + momentum * v[i]! : v[i]!;
      params[i]! -= lr * upd;
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
