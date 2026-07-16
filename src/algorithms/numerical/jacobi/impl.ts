// =============================================================================
// 雅可比迭代（Jacobi Iteration）· 纯算法实现（零 DOM 依赖，可独立单测）
// 解线性方程组 Ax = b 的经典定常迭代：用「上一轮」的全部分量更新每个分量。
// =============================================================================

/** 一轮迭代的信息。 */
export interface JacobiStep {
  iter: number;
  /** 本轮开始时的解向量 x。 */
  x: number[];
  /** 本轮算出的新解向量。 */
  next: number[];
  /** 本轮的残差无穷范数 ||b − A·x||_∞。 */
  residual: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface JacobiHooks {
  onStep?: (step: JacobiStep) => void;
}

/** 雅可比迭代返回结果。 */
export interface JacobiResult {
  x: number[];
  iterations: number;
  converged: boolean;
  steps: JacobiStep[];
}

/**
 * 雅可比迭代解 `A·x = b`。
 *
 * 对每个分量 i，用其它分量的**旧值**更新：
 *
 * `x_i^{(k+1)} = (b_i − Σ_{j≠i} A[i][j]·x_j^{(k)}) / A[i][i]`
 *
 * 直观理解：在第 k 轮，对每个方程「解出」它的对角元变量，用上一轮的其它变量代入。
 * 由于只读旧值，各分量可**并行**更新（这是它与高斯-塞德尔 seidel 的关键区别）。
 *
 * 收敛条件：A 严格对角占优，或对称正定。
 *
 * - 解 `[[4,1],[2,3]]·x = [1,2]` → x ≈ [0.0909, 0.6364]
 *
 * 时间复杂度 `O(k·n²)`（k 轮、n 阶），空间 `O(n)`。
 *
 * @param A 系数矩阵（n×n，对角元非零）
 * @param b 右端向量
 * @param options 初值、容差、最大迭代数
 * @param hooks 可选的事件钩子
 */
export function jacobi(
  A: readonly (readonly number[])[],
  b: readonly number[],
  options: { x0?: number[]; tol?: number; maxIter?: number } = {},
  hooks: JacobiHooks = {},
): JacobiResult {
  const { x0, tol = 1e-10, maxIter = 1000 } = options;
  const n = b.length;
  let x = x0 ? [...x0] : new Array(n).fill(0);
  const steps: JacobiStep[] = [];

  const residual = (cur: number[]): number => {
    let r = 0;
    for (let i = 0; i < n; i++) {
      let s = b[i]!;
      for (let j = 0; j < n; j++) s -= A[i]![j]! * cur[j]!;
      if (Math.abs(s) > r) r = Math.abs(s);
    }
    return r;
  };

  for (let iter = 0; iter < maxIter; iter++) {
    const next = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      let s = b[i]!;
      for (let j = 0; j < n; j++) if (j !== i) s -= A[i]![j]! * x[j]!;
      next[i] = s / A[i]![i]!;
    }
    const res = residual(next);
    const step: JacobiStep = { iter, x: [...x], next, residual: res };
    steps.push(step);
    hooks.onStep?.(step);
    // 收敛判据：相邻解的差或残差足够小
    let maxDiff = 0;
    for (let i = 0; i < n; i++) maxDiff = Math.max(maxDiff, Math.abs(next[i]! - x[i]!));
    x = next;
    if (maxDiff <= tol * (1 + normInf(x)) || res <= tol) {
      return { x, iterations: iter + 1, converged: true, steps };
    }
  }
  return { x, iterations: maxIter, converged: false, steps };
}

const normInf = (v: number[]): number => v.reduce((m, x) => Math.max(m, Math.abs(x)), 0);
