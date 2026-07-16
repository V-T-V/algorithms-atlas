// Brent 求根 · 实现 (简化)
export interface BrHooks {
  onIter?: (i: number, b: number, fb: number) => void;
  onConclude?: (root: number, iters: number) => void;
}
export function brentRoot(
  f: (x: number) => number,
  a: number,
  b: number,
  tol = 1e-9,
  maxIter = 100,
  hooks: BrHooks = {},
): number {
  let fa = f(a),
    fb = f(b);
  if (fa * fb > 0) {
    hooks.onConclude?.(b, 0);
    return b;
  }
  if (Math.abs(fa) < Math.abs(fb)) {
    [a, b] = [b, a];
    [fa, fb] = [fb, fa];
  }
  let c = a,
    fc = fa,
    d = b;
  for (let i = 0; i < maxIter; i++) {
    const m = 0.5 * (a + b);
    if (Math.abs(fb) < tol || Math.abs(b - a) < tol) {
      hooks.onConclude?.(b, i + 1);
      return b;
    }
    hooks.onIter?.(i, b, fb);
    if (fa !== fc && fb !== fc) {
      // 逆二次插值
      const s =
        (a * fb * fc) / ((fa - fb) * (fa - fc)) +
        (b * fa * fc) / ((fb - fa) * (fb - fc)) +
        (c * fa * fb) / ((fc - fa) * (fc - fb));
      d = s;
    } else {
      d = b - (fb * (b - a)) / (fb - fa); // 割线
    }
    if (!(d > Math.min(m, b) && d < Math.max(m, b))) d = m;
    c = b;
    fc = fb;
    b = d;
    fb = f(b);
    if (fa * fb < 0) {
      /* keep */
    } else {
      a = c;
      fa = fc;
    }
  }
  hooks.onConclude?.(b, maxIter);
  return b;
}
