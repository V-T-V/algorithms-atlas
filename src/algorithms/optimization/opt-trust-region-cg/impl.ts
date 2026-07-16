// 信赖域 CG (简化) · 实现
export interface TcHooks {
  onIter?: (i: number, x: number[], fx: number, delta: number) => void;
  onConclude?: (xmin: number[], fmin: number) => void;
}
export function trustRegionCg(
  f: (x: readonly number[]) => number,
  grad: (x: readonly number[]) => number[],
  hess: (x: readonly number[]) => number[][],
  x0: number[],
  maxIter = 50,
  hooks: TcHooks = {},
): { x: number[]; fx: number } {
  const x = [...x0];
  let delta = 1.0;
  for (let it = 0; it < maxIter; it++) {
    const g = grad(x);
    const B = hess(x);
    // 简化: 一步牛顿方向 p = -B^{-1} g (假设可逆), 截断到 delta
    const p = new Array<number>(x.length).fill(0);
    // 用梯度下降近似
    for (let i = 0; i < x.length; i++) p[i] = -g[i]!;
    const np = Math.sqrt(p.reduce((a, b) => a + b * b, 0));
    if (np > delta) for (let i = 0; i < x.length; i++) p[i] = (p[i]! * delta) / np;
    const fxOld = f(x);
    const xNew = x.map((v, i) => v + p[i]!);
    const fxNew = f(xNew);
    const actual = fxOld - fxNew;
    const pred = -(
      g.reduce((a, gi, i) => a + gi * p[i]!, 0) +
      0.5 * p.reduce((a, _, i) => a + B[i]!.reduce((s, bij, j) => s + bij * p[j]!, 0), 0)
    );
    const rho = pred > 0 ? actual / pred : 0;
    if (rho > 0.25) {
      for (let i = 0; i < x.length; i++) x[i] = xNew[i]!;
    }
    if (rho < 0.25) delta *= 0.5;
    else if (rho > 0.75) delta *= 2;
    hooks.onIter?.(it, [...x], fxNew, delta);
    if (Math.abs(actual) < 1e-12) break;
  }
  const fx = f(x);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
