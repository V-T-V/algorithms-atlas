// XGBoost 回归（简化版）· 实现
export interface Leaf {
  feature: number;
  threshold: number;
  left: number;
  right: number;
}
function fitLeaf(X: number[][], g: number[], h: number[], lambda: number): Leaf {
  const d = X[0]!.length;
  let bestScore = -Infinity,
    bestF = 0,
    bestT = 0;
  let bestL = 0,
    bestR = 0;
  for (let f = 0; f < d; f++) {
    const vals = [...new Set(X.map((r) => r[f]!))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const t = (vals[i]! + vals[i + 1]!) / 2;
      let GL = 0,
        HL = 0,
        GR = 0,
        HR = 0;
      for (let k = 0; k < X.length; k++) {
        if (X[k]![f]! <= t) {
          GL += g[k]!;
          HL += h[k]!;
        } else {
          GR += g[k]!;
          HR += h[k]!;
        }
      }
      const score = (GL * GL) / (HL + lambda) + (GR * GR) / (HR + lambda);
      if (score > bestScore) {
        bestScore = score;
        bestF = f;
        bestT = t;
        bestL = -GL / (HL + lambda);
        bestR = -GR / (HR + lambda);
      }
    }
  }
  return { feature: bestF, threshold: bestT, left: bestL, right: bestR };
}
export interface XGBResult {
  leaves: Leaf[];
  init: number;
}
export function xgboostRegression(
  X: number[][],
  y: number[],
  rounds = 20,
  lr = 0.3,
  lambda = 1,
): XGBResult {
  const init = y.reduce((a, b) => a + b, 0) / y.length;
  const pred = new Array<number>(y.length).fill(init);
  const leaves: Leaf[] = [];
  for (let m = 0; m < rounds; m++) {
    const g = y.map((v, i) => pred[i]! - v); // gradient of MSE = pred - y
    const h = new Array<number>(y.length).fill(1); // hessian of MSE = 1
    const leaf = fitLeaf(X, g, h, lambda);
    leaves.push(leaf);
    for (let k = 0; k < y.length; k++)
      pred[k]! += lr * (X[k]![leaf.feature]! <= leaf.threshold ? leaf.left : leaf.right);
  }
  return { leaves, init };
}
export function predictXGB(model: XGBResult, x: number[], lr = 0.3): number {
  let p = model.init;
  for (const l of model.leaves) p += lr * (x[l.feature]! <= l.threshold ? l.left : l.right);
  return p;
}
