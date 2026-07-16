// =============================================================================
// 弹性网络（Elastic Net, L1+L2）· 纯算法实现
// 坐标下降，软阈值 + L2。截距通过中心化处理（不罚）。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface ElasticNetResult {
  coefficients: number[];
  intercept: number;
  predictions: number[];
  mse: number;
  nnz: number;
  iterations: number;
}

export interface ElasticNetHooks {
  onIteration?: (iter: number, coefficients: number[]) => void;
  onCoordinate?: (j: number, oldVal: number, newVal: number, coefficients: number[]) => void;
}

export interface ElasticNetOptions {
  /** 总罚强度 λ。默认 1。 */
  lambda?: number;
  /** L1 占比 α∈[0,1]。默认 0.5。 */
  alpha?: number;
  maxIterations?: number;
  tolerance?: number;
  fitIntercept?: boolean;
}

/** 软阈值算子 S(z, a) = sign(z)·max(|z|−a, 0)。 */
export function softThreshold(z: number, a: number): number {
  if (z > a) return z - a;
  if (z < -a) return z + a;
  return 0;
}

export function elasticNet(
  X: number[][],
  y: number[],
  options: ElasticNetOptions = {},
  hooks: ElasticNetHooks = {},
): ElasticNetResult {
  const lambda = options.lambda ?? 1;
  const alpha = options.alpha ?? 0.5;
  const maxIterations = options.maxIterations ?? 100;
  const tolerance = options.tolerance ?? 1e-6;
  const fitIntercept = options.fitIntercept ?? true;

  const n = X.length;
  const d = X[0]?.length ?? 0;
  if (n === 0) {
    return { coefficients: [], intercept: 0, predictions: [], mse: 0, nnz: 0, iterations: 0 };
  }

  let meanY = 0;
  const meanX = new Array<number>(d).fill(0);
  if (fitIntercept) {
    for (let i = 0; i < n; i++) meanY += y[i]!;
    meanY /= n;
    for (let j = 0; j < d; j++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += X[i]![j]!;
      meanX[j] = s / n;
    }
  }
  const Yc = y.map((v) => v - meanY);
  const Xc = X.map((row) => row.map((v, j) => v - meanX[j]!));

  const colSq = new Array<number>(d).fill(0);
  for (let j = 0; j < d; j++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += Xc[i]![j]! ** 2;
    colSq[j] = s;
  }

  const w = new Array<number>(d).fill(0);
  const l1 = n * lambda * alpha;
  const l2 = n * lambda * (1 - alpha);

  let iter = 0;
  for (; iter < maxIterations; iter++) {
    hooks.onIteration?.(iter, [...w]);
    let maxChange = 0;
    for (let j = 0; j < d; j++) {
      if (colSq[j]! + l2 < 1e-12) continue;
      let partial = 0;
      for (let i = 0; i < n; i++) {
        let pred = 0;
        for (let jj = 0; jj < d; jj++) pred += Xc[i]![jj]! * w[jj]!;
        partial += Xc[i]![j]! * (Yc[i]! - pred);
      }
      // rⱼ = xⱼᵀ(y − X w_{¬j})，补偿当前 w[j]
      const rj = partial + colSq[j]! * w[j]!;
      const oldVal = w[j]!;
      const newVal = softThreshold(rj, l1) / (colSq[j]! + l2);
      w[j] = newVal;
      const change = Math.abs(newVal - oldVal);
      if (change > maxChange) maxChange = change;
      hooks.onCoordinate?.(j, oldVal, newVal, [...w]);
    }
    if (maxChange < tolerance) {
      iter++;
      break;
    }
  }

  const intercept = fitIntercept ? meanY - meanX.reduce((s, m, j) => s + m * w[j]!, 0) : 0;
  const predictions = X.map((row) => intercept + row.reduce((s, v, j) => s + v * w[j]!, 0));
  let sse = 0;
  for (let i = 0; i < n; i++) sse += (predictions[i]! - y[i]!) ** 2;
  const mse = sse / n;
  const nnz = w.filter((v) => Math.abs(v) > 1e-9).length;

  return { coefficients: w, intercept, predictions, mse, nnz, iterations: iter };
}

/** 演示数据：y = 2x1 + 2x2 + 1（x1、x2 相关，弹性网络会同时保留两者）。 */
export function demoData(): { X: number[][]; y: number[] } {
  const X = [
    [1, 1.1],
    [2, 2.1],
    [3, 2.9],
    [4, 4.1],
    [5, 5.0],
  ];
  const y = [
    2 * 1 + 2 * 1.1 + 1,
    2 * 2 + 2 * 2.1 + 1,
    2 * 3 + 2 * 2.9 + 1,
    2 * 4 + 2 * 4.1 + 1,
    2 * 5 + 2 * 5.0 + 1,
  ];
  return { X, y };
}
