// 线性回归梯度下降 · 实现
export interface GDResult {
  w: number[];
  b: number;
  history: number[];
}
export interface GDHooks {
  onEpoch?: (e: number, loss: number) => void;
}
export function gradientDescentLinear(
  X: number[][],
  y: number[],
  lr = 0.01,
  epochs = 100,
  hooks: GDHooks = {},
): GDResult {
  const n = X.length,
    d = X[0]?.length ?? 0;
  const w = new Array<number>(d).fill(0);
  let b = 0;
  const history: number[] = [];
  for (let e = 0; e < epochs; e++) {
    const gw = new Array<number>(d).fill(0);
    let gb = 0,
      loss = 0;
    for (let i = 0; i < n; i++) {
      let pred = b;
      for (let k = 0; k < d; k++) pred += w[k]! * X[i]![k]!;
      const err = pred - y[i]!;
      loss += err * err;
      for (let k = 0; k < d; k++) gw[k]! += err * X[i]![k]!;
      gb += err;
    }
    for (let k = 0; k < d; k++) w[k]! -= (lr * gw[k]!) / n;
    b -= (lr * gb) / n;
    loss /= n;
    history.push(loss);
    hooks.onEpoch?.(e + 1, loss);
  }
  return { w, b, history };
}
