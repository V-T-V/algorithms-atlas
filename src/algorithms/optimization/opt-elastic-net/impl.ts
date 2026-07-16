// 弹性网正则 (坐标下降) · 实现
export interface EnHooks {
  onIter?: (i: number, w: number[], loss: number) => void;
  onConclude?: (w: number[]) => void;
}
export function elasticNet(
  X: ReadonlyArray<readonly number[]>,
  y: readonly number[],
  lambda = 0.1,
  alpha = 0.5,
  maxIter = 100,
  hooks: EnHooks = {},
): number[] {
  const n = X.length,
    d = X[0]!.length;
  const w = new Array<number>(d).fill(0);
  const colSq = new Array<number>(d).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) colSq[j]! += X[i]![j]! * X[i]![j]!;
  for (let it = 0; it < maxIter; it++) {
    let loss = 0;
    for (let j = 0; j < d; j++) {
      let rho = 0;
      for (let i = 0; i < n; i++) {
        let pred = 0;
        for (let k2 = 0; k2 < d; k2++) if (k2 !== j) pred += w[k2]! * X[i]![k2]!;
        rho += X[i]![j]! * (y[i]! - pred);
      }
      const l1 = lambda * alpha,
        l2 = lambda * (1 - alpha);
      if (colSq[j]! + l2 === 0) continue;
      if (rho > l1) w[j] = (rho - l1) / (colSq[j]! + l2);
      else if (rho < -l1) w[j] = (rho + l1) / (colSq[j]! + l2);
      else w[j] = 0;
      loss += Math.abs(w[j]!);
    }
    hooks.onIter?.(it, [...w], loss);
  }
  hooks.onConclude?.(w);
  return w;
}
