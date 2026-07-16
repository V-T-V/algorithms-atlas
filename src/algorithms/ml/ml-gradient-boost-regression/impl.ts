// 梯度提升回归 · 实现
export interface Stump {
  feature: number;
  threshold: number;
  left: number;
  right: number;
}
function fitStump(X: number[][], r: number[]): Stump {
  const d = X[0]!.length;
  let best = Infinity,
    bestF = 0,
    bestT = 0,
    bestL = 0,
    bestR = 0;
  for (let f = 0; f < d; f++) {
    const vals = [...new Set(X.map((row) => row[f]!))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const t = (vals[i]! + vals[i + 1]!) / 2;
      const left = r.filter((_, k) => X[k]![f]! <= t),
        right = r.filter((_, k) => X[k]![f]! > t);
      if (left.length === 0 || right.length === 0) continue;
      const ml = left.reduce((a, b) => a + b, 0) / left.length,
        mr = right.reduce((a, b) => a + b, 0) / right.length;
      let sse = 0;
      for (let k = 0; k < r.length; k++) {
        const p = X[k]![f]! <= t ? ml : mr;
        sse += (r[k]! - p) ** 2;
      }
      if (sse < best) {
        best = sse;
        bestF = f;
        bestT = t;
        bestL = ml;
        bestR = mr;
      }
    }
  }
  return { feature: bestF, threshold: bestT, left: bestL, right: bestR };
}
export interface GBResult {
  stumps: Stump[];
  init: number;
}
export function gradientBoostRegression(
  X: number[][],
  y: number[],
  rounds = 20,
  lr = 0.1,
): GBResult {
  const init = y.reduce((a, b) => a + b, 0) / y.length;
  const pred = new Array<number>(y.length).fill(init);
  const stumps: Stump[] = [];
  for (let m = 0; m < rounds; m++) {
    const r = y.map((v, i) => v - pred[i]!);
    const s = fitStump(X, r);
    stumps.push(s);
    for (let k = 0; k < y.length; k++)
      pred[k]! += lr * (X[k]![s.feature]! <= s.threshold ? s.left : s.right);
  }
  return { stumps, init };
}
export function predictGB(model: GBResult, x: number[], lr = 0.1): number {
  let p = model.init;
  for (const s of model.stumps) p += lr * (x[s.feature]! <= s.threshold ? s.left : s.right);
  return p;
}
