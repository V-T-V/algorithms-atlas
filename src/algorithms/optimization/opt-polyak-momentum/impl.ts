// Polyak 动量 · 实现
export interface PmHooks {
  onIter?: (i: number, x: number[], fx: number) => void;
  onConclude?: (xmin: number[], fmin: number) => void;
}
export function polyakMomentum(
  grad: (x: readonly number[]) => number[],
  x0: number[],
  lr = 0.01,
  gamma = 0.9,
  maxIter = 200,
  hooks: PmHooks = {},
): { x: number[]; fx: number } {
  const x = [...x0];
  const v = new Array<number>(x0.length).fill(0);
  let fx = Infinity;
  for (let it = 0; it < maxIter; it++) {
    const g = grad(x);
    for (let i = 0; i < x.length; i++) {
      v[i] = gamma * v[i]! - lr * g[i]!;
      x[i]! += v[i]!;
    }
    fx = 0.5 * x.reduce((a, b) => a + b * b, 0); // 简化损失 = 0.5|x|² (梯度=自身)
    hooks.onIter?.(it, [...x], fx);
  }
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
