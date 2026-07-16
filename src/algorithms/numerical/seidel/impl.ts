// =============================================================================
// 高斯-塞德尔迭代（Gauss–Seidel）· 纯算法实现（零 DOM 依赖，可独立单测）
// 解线性方程组 Ax = b：用「已更新的新值」替代旧值，比雅可比更快。
// =============================================================================

/** 一轮迭代的信息。 */
export interface SeidelStep {
  iter: number;
  /** 本轮结束时的解向量。 */
  x: number[];
  /** 本轮的残差无穷范数 ||b − A·x||_∞。 */
  residual: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SeidelHooks {
  onStep?: (step: SeidelStep) => void;
}

/** 高斯-塞德尔迭代返回结果。 */
export interface SeidelResult {
  x: number[];
  iterations: number;
  converged: boolean;
  steps: SeidelStep[];
}

/**
 * 高斯-塞德尔迭代解 `A·x = b`。
 *
 * 与雅可比（jacobi）的区别：更新分量 i 时，**立即用本轮已经更新的新值**
 * （j < i 用新值，j > i 仍用旧值）：
 *
 * `x_i^{(k+1)} = (b_i − Σ_{j<i} A[i][j]·x_j^{(k+1)} − Σ_{j>i} A[i][j]·x_j^{(k)}) / A[i][i]`
 *
 * 直观理解：每算出一个新分量马上写回并用于后续方程，信息传播更快。
 *
 * 特点：
 * - 通常比雅可比**收敛快约一倍**（同收敛条件）
 * - **串行**依赖（无法并行更新，这是与雅可比的权衡）
 * - 收敛条件同雅可比：严格对角占优或对称正定；对称正定下必收敛
 *
 * - 解 `[[10,−1,2],[−1,11,−1],[2,−1,10]]·x = [6,25,−11]` → x = [1, 2, −1]
 *
 * 要求对角元非零。时间复杂度 `O(k·n²)`，空间 `O(n)`（原地更新）。
 *
 * @param A 系数矩阵
 * @param b 右端向量
 * @param options 初值、容差、最大迭代数
 * @param hooks 可选的事件钩子
 */
export function seidel(
  A: readonly (readonly number[])[],
  b: readonly number[],
  options: { x0?: number[]; tol?: number; maxIter?: number } = {},
  hooks: SeidelHooks = {},
): SeidelResult {
  const { x0, tol = 1e-10, maxIter = 1000 } = options;
  const n = b.length;
  const x = x0 ? [...x0] : new Array(n).fill(0);
  const steps: SeidelStep[] = [];

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
    const prev = [...x];
    for (let i = 0; i < n; i++) {
      let s = b[i]!;
      for (let j = 0; j < n; j++) if (j !== i) s -= A[i]![j]! * x[j]!;
      x[i] = s / A[i]![i]!; // 立即写回：后续 i 用到的新值
    }
    const res = residual(x);
    const step: SeidelStep = { iter, x: [...x], residual: res };
    steps.push(step);
    hooks.onStep?.(step);
    let maxDiff = 0;
    for (let i = 0; i < n; i++) maxDiff = Math.max(maxDiff, Math.abs(x[i]! - prev[i]!));
    if (maxDiff <= tol * (1 + normInf(x)) || res <= tol) {
      return { x, iterations: iter + 1, converged: true, steps };
    }
  }
  return { x, iterations: maxIter, converged: false, steps };
}

const normInf = (v: number[]): number => v.reduce((m, x) => Math.max(m, Math.abs(x)), 0);
