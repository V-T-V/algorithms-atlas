// =============================================================================
// 不动点迭代（Fixed-Point Iteration）· 纯算法实现（零 DOM 依赖，可独立单测）
// 求迭代函数 g 的不动点 x*，即满足 x* = g(x*)。常用于求解 f(x)=0（改写为 x = g(x)）。
// =============================================================================

/** 一轮迭代的信息。 */
export interface FixedPointStep {
  iter: number;
  x: number;
  next: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FixedPointHooks {
  onIter?: (step: FixedPointStep) => void;
}

/** 不动点迭代返回结果。 */
export interface FixedPointResult {
  root: number;
  iterations: number;
  converged: boolean;
  steps: FixedPointStep[];
}

/**
 * 不动点迭代：求 `x = g(x)` 的不动点。
 *
 * 迭代格式：`x_{n+1} = g(x_n)`。
 *
 * 收敛条件（巴拿赫不动点定理）：若 g 在不动点附近满足 |g'(x)| < 1（即 g 是**压缩映射**），
 * 则迭代**线性收敛**到不动点；否则可能发散或振荡。
 *
 * - 求 `x = cos(x)` 的不动点 ≈ 0.739085（Dottie 数）
 * - 收敛判据：步长 `|x_{n+1} − x_n|` 足够小
 *
 * 时间复杂度 `O(k)`（k 为迭代数），空间 `O(k)`（保存轨迹）。
 *
 * @param g 迭代函数
 * @param x0 初值
 * @param options 收敛容差与最大迭代数
 * @param hooks 可选的事件钩子
 */
export function fixedPoint(
  g: (x: number) => number,
  x0: number,
  options: { tol?: number; maxIter?: number } = {},
  hooks: FixedPointHooks = {},
): FixedPointResult {
  const { tol = 1e-12, maxIter = 1000 } = options;
  const steps: FixedPointStep[] = [];
  let x = x0;
  for (let iter = 0; iter < maxIter; iter++) {
    const next = g(x);
    if (!Number.isFinite(next)) {
      return { root: x, iterations: iter, converged: false, steps };
    }
    const step: FixedPointStep = { iter, x, next };
    steps.push(step);
    hooks.onIter?.(step);
    if (Math.abs(next - x) <= tol * (1 + Math.abs(next))) {
      return { root: next, iterations: iter + 1, converged: true, steps };
    }
    x = next;
  }
  return { root: x, iterations: maxIter, converged: false, steps };
}
