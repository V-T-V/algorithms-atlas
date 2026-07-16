// =============================================================================
// Lasso 回归（L1 正则化）· 纯算法实现
// 坐标下降（coordinate descent）+ 软阈值。截距通过中心化处理（不惩罚）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

export interface LassoResult {
  /** 回归系数（不含截距）。 */
  coefficients: number[];
  /** 截距。 */
  intercept: number;
  /** 训练集预测值。 */
  predictions: number[];
  /** 训练均方误差。 */
  mse: number;
  /** 非零系数个数。 */
  nnz: number;
  /** 实际迭代轮数。 */
  iterations: number;
  /** 是否在容差内收敛。 */
  converged: boolean;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LassoHooks {
  /** 一轮坐标下降开始。 */
  onIteration?: (iter: number, coefficients: number[]) => void;
  /** 更新第 j 个系数：旧值 → 新值。 */
  onCoordinate?: (j: number, oldVal: number, newVal: number, coefficients: number[]) => void;
}

export interface LassoOptions {
  /** L1 罚强度 λ。默认 1。 */
  lambda?: number;
  /** 最大迭代轮数（一轮 = 扫过所有坐标一次）。默认 100。 */
  maxIterations?: number;
  /** 系数变化阈值。默认 1e-6。 */
  tolerance?: number;
  /** 是否拟合截距。默认 true。 */
  fitIntercept?: boolean;
}

/** 软阈值算子 S(z, a) = sign(z)·max(|z|−a, 0)。 */
export function softThreshold(z: number, a: number): number {
  if (z > a) return z - a;
  if (z < -a) return z + a;
  return 0;
}

/**
 * Lasso 回归（坐标下降）。
 *
 * @param X 特征矩阵 n×d
 * @param y 目标值 n
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function lassoRegression(
  X: number[][],
  y: number[],
  options: LassoOptions = {},
  hooks: LassoHooks = {},
): LassoResult {
  const lambda = options.lambda ?? 1;
  const maxIterations = options.maxIterations ?? 100;
  const tolerance = options.tolerance ?? 1e-6;
  const fitIntercept = options.fitIntercept ?? true;

  const n = X.length;
  const d = X[0]?.length ?? 0;
  if (n === 0) {
    return {
      coefficients: [],
      intercept: 0,
      predictions: [],
      mse: 0,
      nnz: 0,
      iterations: 0,
      converged: false,
    };
  }

  // 截距处理：中心化特征与目标（中心化下截距不进入 L1 罚）
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

  // 每列模平方
  const colSq = new Array<number>(d).fill(0);
  for (let j = 0; j < d; j++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += Xc[i]![j]! ** 2;
    colSq[j] = s;
  }

  const w = new Array<number>(d).fill(0);
  let iter = 0;
  let converged = false;

  for (; iter < maxIterations; iter++) {
    hooks.onIteration?.(iter, [...w]);
    let maxChange = 0;
    for (let j = 0; j < d; j++) {
      if (colSq[j]! < 1e-12) continue;
      // rⱼ = xⱼᵀ(y − X w_{¬j}) = xⱼᵀ(y − X w) + xⱼᵀxⱼ·wⱼ
      // 其中 X w 含当前 w[j]，故补偿 colSq[j]·w[j]
      let partial = 0;
      for (let i = 0; i < n; i++) {
        let pred = 0;
        for (let jj = 0; jj < d; jj++) pred += Xc[i]![jj]! * w[jj]!;
        partial += Xc[i]![j]! * (Yc[i]! - pred);
      }
      const rj = partial + colSq[j]! * w[j]!;
      const oldVal = w[j]!;
      const newVal = softThreshold(rj, n * lambda) / colSq[j]!;
      w[j] = newVal;
      const change = Math.abs(newVal - oldVal);
      if (change > maxChange) maxChange = change;
      hooks.onCoordinate?.(j, oldVal, newVal, [...w]);
    }
    if (maxChange < tolerance) {
      converged = true;
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

  return {
    coefficients: w,
    intercept,
    predictions,
    mse,
    nnz,
    iterations: iter,
    converged,
  };
}

/** 演示数据：y = 3x1 + 0·x2 + 2，x2 为无关特征（应被 lasso 压为 0）。 */
export function demoData(): { X: number[][]; y: number[] } {
  const X = [
    [1, 9],
    [2, 3],
    [3, 7],
    [4, 1],
    [5, 5],
  ];
  const y = [5, 8, 11, 14, 17]; // 3·x1 + 2，与 x2 无关
  return { X, y };
}
