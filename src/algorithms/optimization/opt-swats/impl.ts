// SWATS · 实现（简化：达到阈值迭代后切换到 SGD+Momentum）
export interface SwatsHooks {
  onSwitch?: (iter: number) => void;
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface SwatsResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}
export function optSwats(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: {
    lr?: number;
    switchAfter?: number;
    beta1?: number;
    beta2?: number;
    eps?: number;
    momentum?: number;
    maxIter?: number;
    tol?: number;
  } = {},
  hooks: SwatsHooks = {},
): SwatsResult {
  const {
    lr = 0.1,
    switchAfter = 30,
    beta1 = 0.9,
    beta2 = 0.999,
    eps = 1e-8,
    momentum = 0.9,
    maxIter = 500,
    tol = 1e-8,
  } = opts;
  const params = [...init];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  const sgV = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  let phase: 'adam' | 'sgd' = 'adam';
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    if (phase === 'adam') {
      const bc1 = 1 - Math.pow(beta1, it);
      const bc2 = 1 - Math.pow(beta2, it);
      for (let i = 0; i < params.length; i++) {
        m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
        v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
        params[i]! -= (lr * (m[i]! / bc1)) / (Math.sqrt(v[i]! / bc2) + eps);
      }
      if (it >= switchAfter) {
        phase = 'sgd';
        hooks.onSwitch?.(it);
      }
    } else {
      for (let i = 0; i < params.length; i++) {
        sgV[i] = momentum * sgV[i]! + g[i]!;
        params[i]! -= lr * sgV[i]!;
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
