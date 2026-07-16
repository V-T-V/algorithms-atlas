// 二分法求根 · 实现
export interface BsHooks {
  onIter?: (i: number, a: number, b: number, c: number, fc: number) => void;
  onConclude?: (root: number, iters: number) => void;
}
export function bisection(
  f: (x: number) => number,
  a: number,
  b: number,
  tol = 1e-9,
  maxIter = 100,
  hooks: BsHooks = {},
): number {
  let lo = a,
    hi = b;
  for (let i = 0; i < maxIter; i++) {
    const c = (lo + hi) / 2;
    const fc = f(c);
    hooks.onIter?.(i, lo, hi, c, fc);
    if (Math.abs(fc) < tol || (hi - lo) / 2 < tol) {
      hooks.onConclude?.(c, i + 1);
      return c;
    }
    if (f(lo) * fc < 0) hi = c;
    else lo = c;
  }
  const root = (lo + hi) / 2;
  hooks.onConclude?.(root, maxIter);
  return root;
}
