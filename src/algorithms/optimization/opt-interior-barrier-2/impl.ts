// 内点障碍法 · 实现 (简化: min x² s.t. x>=0)
export interface IbHooks {
  onIter?: (i: number, mu: number, x: number, fval: number) => void;
  onConclude?: (xmin: number, fmin: number) => void;
}
export function interiorBarrier(
  f: (x: number) => number,
  grad: (x: number) => number,
  x0: number,
  lo: number,
  mu0 = 1,
  maxIter = 50,
  hooks: IbHooks = {},
): { x: number; fx: number } {
  let x = x0,
    mu = mu0;
  for (let it = 0; it < maxIter; it++) {
    // 障碍梯度: grad - mu/(x-lo)
    const bg = grad(x) - mu / (x - lo);
    x -= 0.1 * bg;
    if (x <= lo) x = lo + 1e-6;
    const fval = f(x) - mu * Math.log(x - lo);
    hooks.onIter?.(it, mu, x, fval);
    mu *= 0.7;
    if (mu < 1e-8) break;
  }
  const fx = f(x);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
