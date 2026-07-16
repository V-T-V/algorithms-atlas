// DFP 拟牛顿 · 实现
export interface DfpHooks {
  onIter?: (i: number, x: number[], fx: number) => void;
  onConclude?: (xmin: number[], fmin: number) => void;
}
export function dfp(
  grad: (x: readonly number[]) => number[],
  x0: number[],
  maxIter = 100,
  hooks: DfpHooks = {},
): { x: number[]; fx: number } {
  const n = x0.length;
  let x = [...x0];
  const H = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );
  let g = grad(x);
  for (let it = 0; it < maxIter; it++) {
    const d = H.map((row) => -row.reduce<number>((a, hij, j) => a + hij * g[j]!, 0));
    const dnorm = Math.sqrt(d.reduce((a, b) => a + b * b, 0));
    if (dnorm < 1e-9) break;
    const xNew = x.map((v, i) => v + 0.01 * d[i]!); // 简化步长
    const gNew = grad(xNew);
    const s = xNew.map((v, i) => v - x[i]!);
    const y = gNew.map((v, i) => v - g[i]!);
    const ys = y.reduce((a, yi, i) => a + yi * s[i]!, 0);
    if (Math.abs(ys) > 1e-12) {
      const Hy = H.map((row) => row.reduce<number>((a, hij, j) => a + hij * y[j]!, 0));
      const yHy = y.reduce((a, yi, i) => a + yi * Hy[i]!, 0);
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) H[i]![j]! += (s[i]! * s[j]!) / ys - (Hy[i]! * Hy[j]!) / yHy;
    }
    x = xNew;
    g = gNew;
    const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
    hooks.onIter?.(it, [...x], fx);
  }
  const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
