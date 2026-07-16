// =============================================================================
// Householder 方法（Householder's Method）· 纯算法实现（零 DOM 依赖，可独立单测）
// 一族高阶求根迭代：d=1 即牛顿法，d=2 即 Halley 法（三阶收敛），d 越大收敛阶越高。
// 本实现聚焦最常用的 d=2（Halley）与 d=1（Newton），用 f、f'、f'' 构造迭代。
// =============================================================================

/** 一轮迭代的信息。 */
export interface HouseholderStep {
  iter: number;
  x: number;
  fx: number;
  next: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HouseholderHooks {
  onIter?: (step: HouseholderStep) => void;
}

/** Householder 方法返回结果。 */
export interface HouseholderResult {
  root: number;
  iterations: number;
  converged: boolean;
  steps: HouseholderStep[];
}

/**
 * Householder 求根迭代（默认 Halley，d=2，**三阶收敛**）。
 *
 * - d = 1（牛顿）：`x_{n+1} = x_n − f / f\'`（二阶）
 * - d = 2（Halley）：`x_{n+1} = x_n − 2·f·f\' / (2·f\'² − f·f\'\')`（三阶）
 *
 * 直观理解：Halley 在牛顿切线基础上，再利用二阶导（曲率）做修正，
 * 使迭代在单根附近具有**三阶收敛**——每迭代一次，有效位数约增至 3 倍。
 * 代价是需要一阶与二阶导数。
 *
 * - 解 `x² − 2 = 0` 得 √2（Halley 通常 3~4 轮即达机器精度）
 *
 * 当 `f\' = 0` 或分母为 0 时无法继续，返回当前结果（converged 视残差而定）。
 *
 * 时间复杂度 `O(k)`，空间 `O(k)`。
 *
 * @param f 目标函数
 * @param df 一阶导
 * @param d2f 二阶导
 * @param x0 初值
 * @param options 阶 d（默认 2 = Halley）、容差、最大迭代数
 * @param hooks 可选的事件钩子
 */
export function householder(
  f: (x: number) => number,
  df: (x: number) => number,
  d2f: (x: number) => number,
  x0: number,
  options: { order?: 1 | 2; tol?: number; maxIter?: number } = {},
  hooks: HouseholderHooks = {},
): HouseholderResult {
  const { order = 2, tol = 1e-12, maxIter = 100 } = options;
  const steps: HouseholderStep[] = [];
  let x = x0;
  for (let iter = 0; iter < maxIter; iter++) {
    const fx = f(x);
    const dfx = df(x);
    if (dfx === 0 || !Number.isFinite(dfx)) {
      return { root: x, iterations: iter, converged: Math.abs(fx) <= tol, steps };
    }
    let next: number;
    if (order === 1) {
      next = x - fx / dfx;
    } else {
      const d2fx = d2f(x);
      const denom = 2 * dfx * dfx - fx * d2fx;
      if (denom === 0 || !Number.isFinite(denom)) {
        return { root: x, iterations: iter, converged: Math.abs(fx) <= tol, steps };
      }
      next = x - (2 * fx * dfx) / denom;
    }
    const step: HouseholderStep = { iter, x, fx, next };
    steps.push(step);
    hooks.onIter?.(step);
    if (Math.abs(next - x) <= tol * (1 + Math.abs(next)) || Math.abs(fx) <= tol) {
      return { root: next, iterations: iter + 1, converged: true, steps };
    }
    x = next;
  }
  return { root: x, iterations: maxIter, converged: false, steps };
}
