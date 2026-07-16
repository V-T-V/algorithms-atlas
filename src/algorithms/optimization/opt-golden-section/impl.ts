// 黄金分割搜索 · 实现
export interface GsHooks2 {
  onIter?: (i: number, a: number, b: number, x1: number, x2: number) => void;
  onConclude?: (xmin: number, iters: number) => void;
}
const GR = (Math.sqrt(5) - 1) / 2;
export function goldenSection(
  f: (x: number) => number,
  a: number,
  b: number,
  tol = 1e-9,
  maxIter = 100,
  hooks: GsHooks2 = {},
): number {
  let lo = a,
    hi = b;
  let c = hi - GR * (hi - lo);
  let d = lo + GR * (hi - lo);
  for (let i = 0; i < maxIter; i++) {
    hooks.onIter?.(i, lo, hi, c, d);
    if (Math.abs(hi - lo) < tol) break;
    if (f(c) < f(d)) {
      hi = d;
      d = c;
      c = hi - GR * (hi - lo);
    } else {
      lo = c;
      c = d;
      d = lo + GR * (hi - lo);
    }
  }
  const xmin = (lo + hi) / 2;
  hooks.onConclude?.(xmin, maxIter);
  return xmin;
}
