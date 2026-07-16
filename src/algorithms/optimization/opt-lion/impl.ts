// Lion 优化器 · 实现
export interface LiHooks {
  onIter?: (i: number, x: number[], fx: number) => void;
  onConclude?: (xmin: number[], fmin: number) => void;
}
export function lion(
  grad: (x: readonly number[]) => number[],
  x0: number[],
  lr = 0.01,
  beta1 = 0.9,
  beta2 = 0.99,
  maxIter = 200,
  hooks: LiHooks = {},
): { x: number[]; fx: number } {
  const d = x0.length;
  const m = new Array<number>(d).fill(0);
  const x = [...x0];
  for (let t = 0; t < maxIter; t++) {
    const g = grad(x);
    for (let i = 0; i < d; i++) {
      const u = Math.sign(beta1 * m[i]! + (1 - beta1) * g[i]!);
      x[i]! -= lr * u;
      m[i] = beta2 * m[i]! + (1 - beta2) * g[i]!;
    }
    const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
    hooks.onIter?.(t, [...x], fx);
  }
  const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
