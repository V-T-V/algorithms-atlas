// =============================================================================
// 贝叶斯线性回归 · 纯算法实现
// 高斯先验 + 高斯似然 → 高斯后验。零 DOM 依赖，可独立单测。
// =============================================================================

/** 后验分布：精度矩阵 Λ 与均值 m。 */
export interface Posterior {
  precision: number[][];
  mean: number[];
  covariance: number[][];
}

export interface BayesianLinearResult {
  posterior: Posterior;
  /** 训练集预测均值。 */
  predictions: number[];
  /** 训练集预测方差。 */
  variances: number[];
  mse: number;
}

export interface BayesianLinearOptions {
  /** 噪声方差 σ²。默认 1。 */
  noiseVar?: number;
  /** 先验精度 τ（先验方差 = 1/τ）。默认 0.01。 */
  priorPrecision?: number;
  /** 是否拟合截距。默认 true。 */
  fitIntercept?: boolean;
}

export interface BayesianLinearHooks {
  /** 已构造精度矩阵。 */
  onPrecision?: (precision: number[][]) => void;
  /** 已算后验均值。 */
  onPosterior?: (mean: number[]) => void;
}

/** 矩阵求逆（高斯-约旦，带部分主元）。 */
function matInverse(m: number[][]): number[][] {
  const n = m.length;
  const aug = m.map((row, i) => {
    const id = new Array<number>(n).fill(0);
    id[i] = 1;
    return [...row, ...id];
  });
  for (let col = 0; col < n; col++) {
    let pivot = col;
    let maxAbs = Math.abs(aug[col]![col]!);
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r]![col]!) > maxAbs) {
        maxAbs = Math.abs(aug[r]![col]!);
        pivot = r;
      }
    }
    [aug[col], aug[pivot]] = [aug[pivot]!, aug[col]!];
    const pv = aug[col]![col]!;
    if (Math.abs(pv) < 1e-14) throw new Error('奇异矩阵 / singular matrix');
    for (let j = 0; j < 2 * n; j++) aug[col]![j]! /= pv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = aug[r]![col]!;
      for (let j = 0; j < 2 * n; j++) aug[r]![j]! -= factor * aug[col]![j]!;
    }
  }
  return aug.map((row) => row.slice(n));
}

function transpose(a: number[][]): number[][] {
  const m = a.length;
  const n = a[0]!.length;
  const out: number[][] = Array.from({ length: n }, () => new Array<number>(m).fill(0));
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) out[j]![i]! = a[i]![j]!;
  return out;
}

function matMul(a: number[][], b: number[][]): number[][] {
  const m = a.length;
  const k = b.length;
  const n = b[0]!.length;
  const c: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += a[i]![t]! * b[t]![j]!;
      c[i]![j] = s;
    }
  return c;
}

function matVec(m: number[][], v: number[]): number[] {
  return m.map((row) => row.reduce((s, mv, idx) => s + mv * v[idx]!, 0));
}

function quadraticForm(x: number[], cov: number[][]): number {
  // xᵀ cov x
  let s = 0;
  for (let i = 0; i < x.length; i++)
    for (let j = 0; j < x.length; j++) s += x[i]! * cov[i]![j]! * x[j]!;
  return s;
}

/**
 * 贝叶斯线性回归（高斯先验 + 高斯似然）。
 *
 * @param X 特征矩阵 n×d
 * @param y 目标值 n
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function bayesianLinearRegression(
  X: number[][],
  y: number[],
  options: BayesianLinearOptions = {},
  hooks: BayesianLinearHooks = {},
): BayesianLinearResult {
  const noiseVar = options.noiseVar ?? 1;
  const priorPrecision = options.priorPrecision ?? 0.01;
  const fitIntercept = options.fitIntercept ?? true;

  const n = X.length;
  if (n === 0) {
    return {
      posterior: { precision: [], mean: [], covariance: [] },
      predictions: [],
      variances: [],
      mse: 0,
    };
  }

  const Xd = X.map((row) => (fitIntercept ? [1, ...row] : [...row]));
  const dim = Xd[0]!.length;
  const Xt = transpose(Xd);
  const XtX = matMul(Xt, Xd);

  // Λ = (1/σ²)XᵀX + τI
  const precision: number[][] = XtX.map((row) => row.map((v) => v / noiseVar));
  for (let i = 0; i < dim; i++) precision[i]![i]! += priorPrecision;
  hooks.onPrecision?.(precision.map((r) => [...r]));

  const cov = matInverse(precision); // Λ⁻¹
  const Xty = Xt.map((row) => row.reduce((s, v, idx) => s + v * y[idx]!, 0));
  // m = (1/σ²)Λ⁻¹ Xᵀy
  const scaledXty = Xty.map((v) => v / noiseVar);
  const mean = matVec(cov, scaledXty);
  hooks.onPosterior?.([...mean]);

  // 预测
  const predictions: number[] = [];
  const variances: number[] = [];
  for (let i = 0; i < n; i++) {
    const xi = Xd[i]!;
    predictions.push(xi.reduce((s, v, idx) => s + v * mean[idx]!, 0));
    variances.push(noiseVar + quadraticForm(xi, cov));
  }

  let sse = 0;
  for (let i = 0; i < n; i++) sse += (predictions[i]! - y[i]!) ** 2;
  const mse = sse / n;

  return {
    posterior: { precision, mean, covariance: cov },
    predictions,
    variances,
    mse,
  };
}

/** 预测新点（返回均值与方差）。 */
export function predict(
  model: BayesianLinearResult,
  x: number[],
  noiseVar: number,
  fitIntercept = true,
): { mean: number; variance: number } {
  const xi = fitIntercept ? [1, ...x] : [...x];
  const mean = xi.reduce((s, v, idx) => s + v * model.posterior.mean[idx]!, 0);
  const variance = noiseVar + quadraticForm(xi, model.posterior.covariance);
  return { mean, variance };
}

/** 演示数据：y = 3x + 2（无噪声便于断言）。 */
export function demoData(): { X: number[][]; y: number[] } {
  const X = [[1], [2], [3], [4], [5]];
  const y = [5, 8, 11, 14, 17];
  return { X, y };
}
