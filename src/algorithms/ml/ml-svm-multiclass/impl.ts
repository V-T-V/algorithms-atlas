// 多分类 SVM（One-vs-Rest）· 实现
export interface PegasosModel {
  w: number[];
  b: number;
  lambda: number;
}
function dot(w: number[], x: number[]): number {
  let s = 0;
  for (let i = 0; i < w.length; i++) s += w[i]! * x[i]!;
  return s;
}
function trainBinary(
  X: number[][],
  y: number[],
  lambda: number,
  epochs: number,
  seed: number,
): PegasosModel {
  const d = X[0]!.length;
  const w = new Array<number>(d).fill(0);
  let b = 0;
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  let t = 1;
  for (let e = 0; e < epochs; e++) {
    for (let i = 0; i < X.length; i++) {
      const xi = X[i]!,
        yi = y[i]!,
        eta = 1 / (lambda * t),
        decay = 1 - eta * lambda;
      for (let k = 0; k < d; k++) w[k]! *= decay;
      b *= decay;
      if (yi * (dot(w, xi) + b) < 1) {
        for (let k = 0; k < d; k++) w[k]! += eta * yi * xi[k]!;
        b += eta * yi;
      }
      t++;
    }
  }
  return { w, b, lambda };
}
export function ovrSvm(
  X: number[][],
  labels: number[],
  k: number,
  lambda = 0.01,
  epochs = 50,
): PegasosModel[] {
  const models: PegasosModel[] = [];
  for (let c = 0; c < k; c++) {
    const y = labels.map((l) => (l === c ? 1 : -1));
    models.push(trainBinary(X, y, lambda, epochs, c + 1));
  }
  return models;
}
export function predictOvr(models: PegasosModel[], x: number[]): number {
  let best = -Infinity,
    bc = 0;
  for (let c = 0; c < models.length; c++) {
    const v = dot(models[c]!.w, x) + models[c]!.b;
    if (v > best) {
      best = v;
      bc = c;
    }
  }
  return bc;
}
