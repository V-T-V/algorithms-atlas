// 试位法 · 实现
export interface RfHooks {
  onIter?: (i: number, a: number, b: number, c: number, fc: number) => void;
  onConclude?: (root: number, iters: number) => void;
}
export function regulaFalsi(
  f: (x: number) => number,
  a: number,
  b: number,
  tol = 1e-9,
  maxIter = 100,
  hooks: RfHooks = {},
): number {
  let lo = a,
    hi = b;
  for (let i = 0; i < maxIter; i++) {
    const fa = f(lo),
      fb = f(hi);
    const c = (lo * fb - hi * fa) / (fb - fa);
    const fc = f(c);
    hooks.onIter?.(i, lo, hi, c, fc);
    if (Math.abs(fc) < tol) {
      hooks.onConclude?.(c, i + 1);
      return c;
    }
    if (fa * fc < 0) hi = c;
    else lo = c;
  }
  const root = (lo + hi) / 2;
  hooks.onConclude?.(root, maxIter);
  return root;
}
