// =============================================================================
// 岭回归（Ridge Regression）· 纯算法实现
// β = (XᵀX + λI)⁻¹ · Xᵀy，用高斯消元求解。
// =============================================================================

export interface RidgeResult {
  /** 回归系数（含截距项在 index 0，若 fitIntercept=true）。 */
  coefficients: number[];
  /** 截距。 */
  intercept: number;
}

export interface RidgeHooks {
  /** 构造完正则化正规方程 (XᵀX + λI)。 */
  onNormalEquation?: (xtx: number[][], xty: number[]) => void;
  /** 完成。 */
  onDone?: (result: RidgeResult) => void;
}

type Mat = number[][];

/** 高斯消元（带部分主元）解 A·x = b。 */
function solveLinear(A: Mat, b: number[]): number[] {
  const n = A.length;
  const M: Mat = A.map((row, i) => [...row, b[i]!]);
  for (let col = 0; col < n; col++) {
    // 选主元
    let piv = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r]![col]!) > Math.abs(M[piv]![col]!)) piv = r;
    }
    if (Math.abs(M[piv]![col]!) < 1e-12) throw new Error('矩阵奇异，无法求解');
    const tmpRow = M[col]!;
    M[col] = M[piv]!;
    M[piv] = tmpRow;
    // 消元
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = M[r]![col]! / M[col]![col]!;
      for (let c = col; c <= n; c++) M[r]![c] = M[r]![c]! - factor * M[col]![c]!;
    }
  }
  return M.map((row, i) => row[n]! / row[i]!);
}

/**
 * 岭回归。
 * @param X 样本特征矩阵 m×n
 * @param y 标签长度 m
 * @param lambda L2 正则化系数（>= 0）
 * @param fitIntercept 是否拟合截距（默认 true，自动中心化）
 */
export function ridgeRegression(
  X: readonly number[][],
  y: readonly number[],
  lambda: number,
  fitIntercept = true,
  hooks: RidgeHooks = {},
): RidgeResult {
  const m = X.length;
  if (m === 0) throw new RangeError('样本不能为空');
  const n = X[0]!.length;
  if (y.length !== m) throw new RangeError('X 与 y 行数不一致');
  if (lambda < 0) throw new RangeError(`lambda 须 >= 0，收到 ${lambda}`);

  // 中心化（若拟合截距）
  let xMean = new Array(n).fill(0);
  let yMean = 0;
  if (fitIntercept) {
    xMean = new Array(n).fill(0);
    for (let j = 0; j < n; j++) for (let i = 0; i < m; i++) xMean[j]! += X[i]![j]!;
    xMean = xMean.map((s) => s / m);
    yMean = 0;
    for (let i = 0; i < m; i++) yMean += y[i]!;
    yMean /= m;
  }
  const Xc: Mat = X.map((row) => row.map((v, j) => v - xMean[j]!));
  const yc = y.map((v) => v - yMean);

  // XᵀX + λI
  const XtX: Mat = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let k = 0; k < m; k++) s += Xc[k]![i]! * Xc[k]![j]!;
      XtX[i]![j] = s + (i === j ? lambda : 0);
    }
  }
  // Xᵀy
  const Xty: number[] = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let k = 0; k < m; k++) s += Xc[k]![i]! * yc[k]!;
    Xty[i] = s;
  }
  hooks.onNormalEquation?.(XtX, Xty);

  const beta = solveLinear(XtX, Xty);
  const intercept = fitIntercept ? yMean - xMean.reduce((acc, mj, j) => acc + mj * beta[j]!, 0) : 0;
  const result: RidgeResult = { coefficients: beta, intercept };
  hooks.onDone?.(result);
  return result;
}

/** 用回归结果预测。 */
export function predict(model: RidgeResult, X: readonly number[][]): number[] {
  return X.map(
    (row) => model.intercept + row.reduce((acc, v, j) => acc + v * model.coefficients[j]!, 0),
  );
}
