// 近端梯度 (Lasso) · 实现
export interface PgHooks2 {
  onIter?: (i: number, w: number[], loss: number) => void;
  onConclude?: (w: number[]) => void;
}
function softThreshold(z: number, lam: number): number {
  return z > lam ? z - lam : z < -lam ? z + lam : 0;
}
export function proximalGradient(
  X: ReadonlyArray<readonly number[]>,
  y: readonly number[],
  lam: number,
  lr = 0.01,
  maxIter = 100,
  hooks: PgHooks2 = {},
): number[] {
  const n = X.length,
    d = X[0]!.length;
  const w = new Array<number>(d).fill(0);
  for (let it = 0; it < maxIter; it++) {
    const grad = new Array<number>(d).fill(0);
    let loss = 0;
    for (let i = 0; i < n; i++) {
      let p = 0;
      for (let j = 0; j < d; j++) p += w[j]! * X[i]![j]!;
      const r = p - y[i]!;
      loss += r * r;
      for (let j = 0; j < d; j++) grad[j]! += r * X[i]![j]!;
    }
    for (let j = 0; j < d; j++) w[j] = softThreshold(w[j]! - (lr * grad[j]!) / n, lr * lam);
    hooks.onIter?.(it, [...w], loss / n);
  }
  hooks.onConclude?.(w);
  return w;
}
