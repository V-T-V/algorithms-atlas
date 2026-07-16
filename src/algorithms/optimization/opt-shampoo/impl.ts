// Shampoo (简化一维近似) · 实现
export interface ShHooks {
  onIter?: (i: number, w: number[], fx: number) => void;
  onConclude?: (w: number[]) => void;
}
export function shampoo(
  grad: (w: readonly number[]) => number[],
  w0: number[],
  lr = 0.01,
  eps = 1e-6,
  maxIter = 200,
  hooks: ShHooks = {},
): number[] {
  const d = w0.length;
  const w = [...w0];
  const stat = new Array<number>(d).fill(0); // 各维梯度平方统计
  for (let t = 0; t < maxIter; t++) {
    const g = grad(w);
    for (let i = 0; i < d; i++) {
      stat[i] = 0.9 * stat[i]! + 0.1 * Math.abs(g[i]!);
      w[i]! -= (lr * g[i]!) / (Math.sqrt(stat[i]!) + eps);
    }
    const fx = 0.5 * w.reduce((a, b) => a + b * b, 0);
    hooks.onIter?.(t, [...w], fx);
  }
  hooks.onConclude?.(w);
  return w;
}
