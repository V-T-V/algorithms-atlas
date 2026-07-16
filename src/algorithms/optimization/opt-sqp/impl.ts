// SQP (简化: 等式约束, B=I) · 实现
export interface SqpHooks {
  onIter?: (i: number, x: number, viol: number) => void;
  onConclude?: (xmin: number, fmin: number) => void;
}
export function sqp(
  f: (x: number) => number,
  gradf: (x: number) => number[],
  c: (x: number) => number,
  gradc: (x: number) => number,
  x0: number,
  maxIter = 50,
  hooks: SqpHooks = {},
): { x: number; fx: number } {
  let x = x0,
    lam = 0;
  for (let it = 0; it < maxIter; it++) {
    const g = gradf(x),
      a = gradc(x),
      cv = c(x);
    // 解 QP: min ½d²+gd s.t. a·d+cv=0 => d = -(g + lam*a)/1, lam = (cv - a*g/(a²+...))
    // 简化一维
    lam = (a * g[0]! - cv) / (a * a + 1e-8);
    const d = -(g[0]! + lam * a);
    x += 0.5 * d;
    x += 0.5 * d;
    hooks.onIter?.(it, x, Math.abs(c(x)));
    if (Math.abs(d) < 1e-9) break;
  }
  const fx = f(x);
  hooks.onConclude?.(x, fx);
  void lam;
  return { x, fx };
}
