// 牛顿迭代 · 实现
export interface NrHooks {
  onIter?: (i: number, x: number, fx: number) => void;
  onConclude?: (root: number, iters: number) => void;
}
export function newtonRaphson(
  f: (x: number) => number,
  df: (x: number) => number,
  x0: number,
  tol = 1e-9,
  maxIter = 50,
  hooks: NrHooks = {},
): number {
  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    const fx = f(x);
    hooks.onIter?.(i, x, fx);
    if (Math.abs(fx) < tol) {
      hooks.onConclude?.(x, i);
      return x;
    }
    const d = df(x);
    if (Math.abs(d) < 1e-15) break;
    x = x - fx / d;
  }
  hooks.onConclude?.(x, maxIter);
  return x;
}
