// Lookahead · 实现（内层用 SGD+Momentum）
export interface LookaheadHooks {
  onSync?: (step: number, slow: number[]) => void;
}
export interface LookaheadResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}
export function optLookahead2(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; alpha?: number; k?: number; maxIter?: number; tol?: number } = {},
  hooks: LookaheadHooks = {},
): LookaheadResult {
  const { lr = 0.1, alpha = 0.5, k = 5, maxIter = 500, tol = 1e-8 } = opts;
  const slow = [...init];
  const fast = [...init];
  const v = new Array(init.length).fill(0);
  let iterations = 0;
  let converged = false;
  const outerIters = Math.ceil(maxIter / k);
  for (let o = 1; o <= outerIters; o++) {
    for (let s = 0; s < k; s++) {
      const g = grad(fast);
      for (let i = 0; i < fast.length; i++) {
        v[i] = 0.9 * v[i]! + g[i]!;
        fast[i]! -= lr * v[i]!;
      }
      iterations++;
    }
    for (let i = 0; i < slow.length; i++) slow[i] = slow[i]! + alpha * (fast[i]! - slow[i]!);
    for (let i = 0; i < fast.length; i++) fast[i] = slow[i]!;
    hooks.onSync?.(o, [...slow]);
    const gn = Math.sqrt(grad(slow).reduce((s, x) => s + x * x, 0));
    if (gn < tol) {
      converged = true;
      break;
    }
  }
  return { params: slow, value: f(slow), iterations, converged };
}
/** 演示目标 f(x,y) = (x-3)^2 + (y+1)^2，最优解 (3,-1)。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}
/** 演示梯度 ∇f = [2(x-3), 2(y+1)]。 */
export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 3), 2 * (p[1]! + 1)];
}
