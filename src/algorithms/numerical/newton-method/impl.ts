// =============================================================================
// 牛顿迭代法（Newton's Method / Newton-Raphson）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 一轮牛顿迭代的信息。 */
export interface NewtonStep {
  /** 迭代号，从 0 开始（x0 为初值）。 */
  iter: number;
  /** 当前估计 x_n。 */
  x: number;
  /** 函数值 f(x_n)。 */
  fx: number;
  /** 导数值 f'(x_n)。 */
  dfx: number;
  /** 下一个估计 x_{n+1} = x_n - f(x_n)/f'(x_n)。 */
  next: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NewtonMethodHooks {
  /** 完成一轮迭代。 */
  onIter?: (step: NewtonStep) => void;
}

/** 牛顿迭代返回结果。 */
export interface NewtonResult {
  /** 求得的近似根。 */
  root: number;
  /** 迭代轮数（不含初值）。 */
  iterations: number;
  /** 是否在 maxIter 内收敛。 */
  converged: boolean;
  /** 每轮迭代信息（含初值的记录见 steps[0] 即第 0 轮由 x0 计算 next）。 */
  steps: NewtonStep[];
}

/**
 * 牛顿迭代法求方程 `f(x) = 0` 的根。
 *
 * 迭代公式：`x_{n+1} = x_n - f(x_n) / f'(x_n)`
 *
 * 在根附近用切线近似曲线：以当前点的切线与 x 轴的交点作为下一个估计。
 * 收敛速度快（二阶收敛），但需要导数、且对初值敏感。
 *
 * @param f 目标函数
 * @param df 目标函数的导数
 * @param x0 初始猜测
 * @param options 收敛容差与最大迭代次数
 * @param hooks 可选的事件钩子
 */
export function newtonMethod(
  f: (x: number) => number,
  df: (x: number) => number,
  x0: number,
  options: { tol?: number; maxIter?: number } = {},
  hooks: NewtonMethodHooks = {},
): NewtonResult {
  const { tol = 1e-12, maxIter = 100 } = options;
  const steps: NewtonStep[] = [];
  let x = x0;

  for (let iter = 0; iter < maxIter; iter++) {
    const fx = f(x);
    const dfx = df(x);
    if (dfx === 0 || !Number.isFinite(dfx)) {
      // 导数为 0 或溢出，无法继续
      return { root: x, iterations: iter, converged: false, steps };
    }
    const next = x - fx / dfx;
    const step: NewtonStep = { iter, x, fx, dfx, next };
    steps.push(step);
    hooks.onIter?.(step);

    // 收敛判据：步长足够小 或 残差足够小
    if (Math.abs(next - x) <= tol * (1 + Math.abs(next)) || Math.abs(fx) <= tol) {
      return { root: next, iterations: iter + 1, converged: true, steps };
    }
    x = next;
  }
  return { root: x, iterations: maxIter, converged: false, steps };
}
