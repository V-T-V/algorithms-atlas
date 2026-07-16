// 批量梯度下降 · 实现 (线性回归)
export interface BgdHooks {
  onIter?: (i: number, w: number[], loss: number) => void;
  onConclude?: (w: number[], loss: number) => void;
}
export function batchGradientDescent(
  X: ReadonlyArray<readonly number[]>,
  y: readonly number[],
  lr = 0.01,
  maxIter = 200,
  hooks: BgdHooks = {},
): { w: number[]; loss: number } {
  const d = X[0]!.length;
  const w = new Array<number>(d).fill(0);
  const n = X.length;
  for (let it = 0; it < maxIter; it++) {
    const grad = new Array<number>(d).fill(0);
    let loss = 0;
    for (let i = 0; i < n; i++) {
      let pred = 0;
      for (let j = 0; j < d; j++) pred += w[j]! * X[i]![j]!;
      const err = pred - y[i]!;
      loss += err * err;
      for (let j = 0; j < d; j++) grad[j]! += err * X[i]![j]!;
    }
    for (let j = 0; j < d; j++) w[j]! -= (lr * grad[j]!) / n;
    hooks.onIter?.(it, [...w], loss / n);
  }
  let loss = 0;
  for (let i = 0; i < n; i++) {
    let p = 0;
    for (let j = 0; j < d; j++) p += w[j]! * X[i]![j]!;
    loss += (p - y[i]!) ** 2;
  }
  hooks.onConclude?.(w, loss / n);
  return { w, loss: loss / n };
}
