// =============================================================================
// 岭回归（L2 正则化）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 闭式解：w = (XᵀX + λI)⁻¹ Xᵀy。截距通过在 X 前补一列 1 实现（不惩罚）。
// =============================================================================

export interface RidgeResult {
  /** 回归系数（含截距为第一个元素）。 */
  weights: number[];
  /** 截距。 */
  intercept: number;
  /** 斜率系数（不含截距）。 */
  coefficients: number[];
  /** 训练集预测值。 */
  predictions: number[];
  /** 训练均方误差。 */
  mse: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface RidgeHooks {
  /** 已构造 XᵀX 矩阵。 */
  onGram?: (gram: number[][]) => void;
  /** 加正则后求解正规方程。 */
  onSolve?: (weights: number[]) => void;
}

export interface RidgeOptions {
  /** L2 罚强度 λ。默认 1。 */
  lambda?: number;
  /** 是否拟合截距。默认 true。 */
  fitIntercept?: boolean;
}

/**
 * 矩阵求逆：高斯-约旦消元（带部分主元选择）。n×n。
 * 对奇异矩阵返回单位阵并抛出标记（本实现通过加 λI 保证可逆）。
 */
export function matInverse(m: number[][]): number[][] {
  const n = m.length;
  const aug = m.map((row, i) => {
    const id = new Array<number>(n).fill(0);
    id[i] = 1;
    return [...row, ...id];
  });
  for (let col = 0; col < n; col++) {
    // 主元选择
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
    if (Math.abs(pv) < 1e-12) throw new Error('奇异矩阵 / singular matrix');
    for (let j = 0; j < 2 * n; j++) aug[col]![j]! /= pv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = aug[r]![col]!;
      for (let j = 0; j < 2 * n; j++) aug[r]![j]! -= factor * aug[col]![j]!;
    }
  }
  return aug.map((row) => row.slice(n));
}

/** 矩阵乘法 a(m×k) × b(k×n) = c(m×n)。 */
export function matMul(a: number[][], b: number[][]): number[][] {
  const m = a.length;
  const k = b.length;
  const n = b[0]!.length;
  const c: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += a[i]![t]! * b[t]![j]!;
      c[i]![j] = s;
    }
  }
  return c;
}

/** 转置。 */
export function transpose(a: number[][]): number[][] {
  const m = a.length;
  const n = a[0]!.length;
  const out: number[][] = Array.from({ length: n }, () => new Array<number>(m).fill(0));
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) out[j]![i]! = a[i]![j]!;
  return out;
}

/**
 * 岭回归（闭式解）。
 *
 * @param X 特征矩阵 n×d
 * @param y 目标值 n
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function ridgeRegression(
  X: number[][],
  y: number[],
  options: RidgeOptions = {},
  hooks: RidgeHooks = {},
): RidgeResult {
  const lambda = options.lambda ?? 1;
  const fitIntercept = options.fitIntercept ?? true;
  const n = X.length;

  if (n === 0) {
    return { weights: [], intercept: 0, coefficients: [], predictions: [], mse: 0 };
  }

  // 在 X 前补一列 1（截距），且不惩罚它
  const Xd = X.map((row) => (fitIntercept ? [1, ...row] : [...row]));
  const dim = Xd[0]!.length;
  const Xt = transpose(Xd);
  const XtX = matMul(Xt, Xd);

  // 加 λI（跳过截距位）
  for (let i = fitIntercept ? 1 : 0; i < dim; i++) {
    XtX[i]![i]! += lambda;
  }
  hooks.onGram?.(XtX.map((r) => [...r]));

  // Xᵀy
  const Xty = Xt.map((row) => row.reduce((s, v, idx) => s + v * y[idx]!, 0));
  const inv = matInverse(XtX);
  // w = inv · Xty  (dim×dim · dim×1)
  const weights = inv.map((row) => row.reduce((s, v, idx) => s + v * Xty[idx]!, 0));
  hooks.onSolve?.([...weights]);

  // 预测
  const predictions = Xd.map((row) => row.reduce((s, v, idx) => s + v * weights[idx]!, 0));
  let sse = 0;
  for (let i = 0; i < n; i++) sse += (predictions[i]! - y[i]!) ** 2;
  const mse = sse / n;

  const intercept = fitIntercept ? weights[0]! : 0;
  const coefficients = fitIntercept ? weights.slice(1) : weights;

  return { weights, intercept, coefficients, predictions, mse };
}

/** 演示数据生成：y = 3x + 2 + 噪声（这里无噪声便于断言）。 */
export function demoData(): { X: number[][]; y: number[] } {
  const X = [[1], [2], [3], [4], [5]];
  const y = [5, 8, 11, 14, 17]; // 3x + 2
  return { X, y };
}
