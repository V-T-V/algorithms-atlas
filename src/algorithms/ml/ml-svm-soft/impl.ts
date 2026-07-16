// 软间隔 SVM（Pegasos）· 实现
export interface PegasosModel {
  w: number[];
  b: number;
  lambda: number;
}
export interface PegasosHooks {
  onEpoch?: (epoch: number, loss: number) => void;
}
function dot(w: number[], x: number[]): number {
  let s = 0;
  for (let i = 0; i < w.length; i++) s += w[i]! * x[i]!;
  return s;
}
export function trainPegasos(
  X: number[][],
  y: number[],
  lambda: number,
  epochs = 50,
  seed = 1,
  hooks: PegasosHooks = {},
): PegasosModel {
  const n = X.length;
  if (n === 0) throw new RangeError('训练集为空');
  if (y.length !== n) throw new RangeError('标签数不匹配');
  for (const v of y) if (v !== 1 && v !== -1) throw new RangeError('标签必须为 ±1');
  if (lambda <= 0) throw new RangeError('lambda 必须为正');
  const d = X[0]!.length;
  const w = new Array<number>(d).fill(0);
  let b = 0;
  let s = seed >>> 0;
  const rand = (): number => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  let t = 1;
  for (let epoch = 0; epoch < epochs; epoch++) {
    const idx = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [idx[i], idx[j]] = [idx[j]!, idx[i]!];
    }
    for (const i of idx) {
      const xi = X[i]!,
        yi = y[i]!;
      const eta = 1 / (lambda * t);
      const margin = yi * (dot(w, xi) + b);
      const decay = 1 - eta * lambda;
      for (let k = 0; k < d; k++) w[k]! *= decay;
      b *= decay;
      if (margin < 1) {
        for (let k = 0; k < d; k++) w[k]! += eta * yi * xi[k]!;
        b += eta * yi;
      }
      t++;
    }
    let loss = 0;
    for (let i = 0; i < n; i++) {
      const m = y[i]! * (dot(w, X[i]!) + b);
      if (m < 1) loss += 1 - m;
    }
    loss /= n;
    hooks.onEpoch?.(epoch + 1, loss);
  }
  return { w, b, lambda };
}
export function decisionValue(model: PegasosModel, x: number[]): number {
  return dot(model.w, x) + model.b;
}
export function predictSVM(model: PegasosModel, x: number[]): number {
  return decisionValue(model, x) >= 0 ? 1 : -1;
}
