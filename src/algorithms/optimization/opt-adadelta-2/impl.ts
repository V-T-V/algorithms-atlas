// opt-adadelta-2 · 实现
export interface AdadeltaHooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface AdadeltaResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}
export function optAdadelta2(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; decay?: number; eps?: number; maxIter?: number; tol?: number } = {},
  hooks: AdadeltaHooks = {},
): AdadeltaResult {
  const { lr: _lr = 1.0, decay = 0.9, eps = 1e-8, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const v = new Array(params.length).fill(0);
  const d = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    for (let i = 0; i < params.length; i++) {
      // adadelta: 无需 lr
      v[i] = decay * v[i]! + (1 - decay) * g[i]! * g[i]!;
      const delta = (-Math.sqrt(d[i]! + eps) / (Math.sqrt(v[i]!) + eps)) * g[i]!;
      params[i]! += delta;
      d[i] = decay * d[i]! + (1 - decay) * delta * delta;
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
