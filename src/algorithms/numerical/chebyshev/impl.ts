// =============================================================================
// 切比雪夫求根法（Chebyshev's Method）· 纯算法实现（零 DOM 依赖，可独立单测）
// 用 f、f′、f′′ 构造的三阶求根迭代，与 Halley 法同族但形式不同。
// =============================================================================

/** 一轮迭代的信息。 */
export interface ChebyshevStep {
  iter: number;
  x: number;
  fx: number;
  next: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ChebyshevHooks {
  onIter?: (step: ChebyshevStep) => void;
}

/** 切比雪夫求根返回结果。 */
export interface ChebyshevResult {
  root: number;
  iterations: number;
  converged: boolean;
  steps: ChebyshevStep[];
}

/**
 * 切比雪夫求根法（三阶收敛）。
 *
 * 迭代公式（在牛顿步基础上加入二阶导修正）：
 *
 * `x_{n+1} = x_n − f/f′ − (f² · f′′) / (2 · f′³)`
 *
 * 它等价于把 `f` 的反函数在根附近做切比雪夫多项式展开取前三项。
 * 与 Halley 法（householder, order=2）同为**三阶收敛**，但迭代式不同。
 *
 * - 在单根附近每步有效位数约增至 **3 倍**
 * - 需要 f、f′、f′′（三个函数求值）
 * - 当 `f′ = 0` 时无法继续
 *
 * - 解 `x² − 2 = 0` 得 √2（通常 3~4 轮即达机器精度）
 *
 * 时间复杂度 `O(k)`，空间 `O(k)`。
 *
 * @param f 目标函数
 * @param df 一阶导
 * @param d2f 二阶导
 * @param x0 初值
 * @param options 容差与最大迭代数
 * @param hooks 可选的事件钩子
 */
export function chebyshev(
  f: (x: number) => number,
  df: (x: number) => number,
  d2f: (x: number) => number,
  x0: number,
  options: { tol?: number; maxIter?: number } = {},
  hooks: ChebyshevHooks = {},
): ChebyshevResult {
  const { tol = 1e-12, maxIter = 100 } = options;
  const steps: ChebyshevStep[] = [];
  let x = x0;
  for (let iter = 0; iter < maxIter; iter++) {
    const fx = f(x);
    const dfx = df(x);
    if (dfx === 0 || !Number.isFinite(dfx)) {
      return { root: x, iterations: iter, converged: Math.abs(fx) <= tol, steps };
    }
    const d2fx = d2f(x);
    const newtonStep = fx / dfx;
    const correction = (fx * fx * d2fx) / (2 * dfx * dfx * dfx);
    const next = x - newtonStep - correction;
    const step: ChebyshevStep = { iter, x, fx, next };
    steps.push(step);
    hooks.onIter?.(step);
    if (Math.abs(next - x) <= tol * (1 + Math.abs(next)) || Math.abs(fx) <= tol) {
      return { root: next, iterations: iter + 1, converged: true, steps };
    }
    x = next;
  }
  return { root: x, iterations: maxIter, converged: false, steps };
}
