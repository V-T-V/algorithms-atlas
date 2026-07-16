// 增广拉格朗日 · 实现 (等式约束 c(x)=0)
export interface AlHooks {
  onIter?: (i: number, x: number, lambda: number, violation: number) => void;
  onConclude?: (xmin: number, fmin: number) => void;
}
export function augmentedLagrangian(
  f: (x: number) => number,
  gradf: (x: number) => number,
  c: (x: number) => number,
  gradc: (x: number) => number,
  x0: number,
  maxIter = 30,
  hooks: AlHooks = {},
): { x: number; fx: number } {
  let x = x0,
    lambda = 0,
    mu = 10;
  for (let it = 0; it < maxIter; it++) {
    // 内层: 几步梯度下降极小化 L_A
    for (let inner = 0; inner < 20; inner++) {
      const g = gradf(x) + (lambda + mu * c(x)) * gradc(x);
      x -= 0.01 * g;
    }
    const violation = Math.abs(c(x));
    hooks.onIter?.(it, x, lambda, violation);
    lambda = lambda + mu * c(x);
    if (violation > 1e-3) mu *= 5;
  }
  const fx = f(x);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
