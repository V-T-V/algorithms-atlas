// =============================================================================
// 线性回归 Linear Regression（最小二乘 OLS）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露推导过程，供录制器使用。
// =============================================================================

/** 一个二维观测点。 */
export interface Observation {
  x: number;
  y: number;
}

export interface LinearFit {
  /** 斜率。 */
  slope: number;
  /** 截距。 */
  intercept: number;
  /** 决定系数 R²（拟合优度）。 */
  r2: number;
  /** 残差（每个点 y - ŷ）。 */
  residuals: number[];
  /** 预测值 ŷ。 */
  predicted: number[];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LinearRegressionHooks {
  /** 统计量就绪：均值、方差、协方差。 */
  onStats?: (meanX: number, meanY: number, varX: number, covXY: number) => void;
  /** 斜率已确定。 */
  onUpdateSlope?: (slope: number) => void;
  /** 截距已确定。 */
  onUpdateIntercept?: (intercept: number) => void;
  /** 收敛/最终拟合完成。 */
  onConverge?: (fit: LinearFit) => void;
}

/**
 * 普通最小二乘（OLS）线性回归：求 ŷ = slope·x + intercept。
 * 闭式解：slope = Cov(x,y) / Var(x)，intercept = ȳ − slope·x̄。
 *
 * @param data 观测点
 * @param hooks 可选的事件钩子
 */
export function linearRegression(
  data: Observation[],
  hooks: LinearRegressionHooks = {},
): LinearFit {
  const n = data.length;
  if (n === 0) {
    return { slope: 0, intercept: 0, r2: 0, residuals: [], predicted: [] };
  }
  if (n === 1) {
    // 单点：水平线过该点
    const y = data[0]!.y;
    const fit: LinearFit = {
      slope: 0,
      intercept: y,
      r2: 0,
      residuals: [0],
      predicted: [y],
    };
    hooks.onConverge?.(fit);
    return fit;
  }

  // 均值
  let sumX = 0,
    sumY = 0;
  for (const d of data) {
    sumX += d.x;
    sumY += d.y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  // 方差与协方差（分母用 n，等价于 MLE 估计；不影响斜率符号）
  let ssXX = 0,
    ssYY = 0,
    ssXY = 0;
  for (const d of data) {
    const dx = d.x - meanX;
    const dy = d.y - meanY;
    ssXX += dx * dx;
    ssYY += dy * dy;
    ssXY += dx * dy;
  }
  const varX = ssXX / n;
  const covXY = ssXY / n;
  hooks.onStats?.(meanX, meanY, varX, covXY);

  const slope = ssXX === 0 ? 0 : ssXY / ssXX;
  hooks.onUpdateSlope?.(slope);

  const intercept = meanY - slope * meanX;
  hooks.onUpdateIntercept?.(intercept);

  // 预测值与残差
  const predicted = data.map((d) => slope * d.x + intercept);
  const residuals = data.map((d, i) => d.y - predicted[i]!);

  // R² = 1 - SS_res / SS_tot
  const ssRes = residuals.reduce((s, r) => s + r * r, 0);
  const r2 = ssYY === 0 ? 1 : 1 - ssRes / ssYY;

  const fit: LinearFit = { slope, intercept, r2, residuals, predicted };
  hooks.onConverge?.(fit);
  return fit;
}

/** 用拟合直线预测 x 处的值。 */
export function predict(fit: LinearFit, x: number): number {
  return fit.slope * x + fit.intercept;
}
