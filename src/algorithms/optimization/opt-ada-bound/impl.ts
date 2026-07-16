// AdaBound · 实现
export interface AbHooks {
  onIter?: (i: number, x: number[], fx: number) => void;
  onConclude?: (xmin: number[], fmin: number) => void;
}
export function adabound(
  grad: (x: readonly number[]) => number[],
  x0: number[],
  lr = 0.01,
  beta1 = 0.9,
  beta2 = 0.999,
  finalLr = 0.1,
  gamma = 0.001,
  maxIter = 200,
  hooks: AbHooks = {},
): { x: number[]; fx: number } {
  const d = x0.length;
  const m = new Array<number>(d).fill(0);
  const v = new Array<number>(d).fill(0);
  const x = [...x0];
  for (let t = 1; t <= maxIter; t++) {
    const g = grad(x);
    const lower = lr - lr * (1 - 1 / (t * gamma + 1));
    const upper = lr + lr * (1 - 1 / (t * gamma + 1));
    for (let i = 0; i < d; i++) {
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
      const mhat = m[i]! / (1 - Math.pow(beta1, t));
      const vhat = v[i]! / (1 - Math.pow(beta2, t));
      let step = (lr * mhat) / (Math.sqrt(vhat) + 1e-8);
      step = Math.max((finalLr * lower) / lr, Math.min((finalLr * upper) / lr, step));
      x[i]! -= step;
    }
    const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
    hooks.onIter?.(t - 1, [...x], fx);
  }
  const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
