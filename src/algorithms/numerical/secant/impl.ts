// =============================================================================
// 割线法（Secant Method）· 纯算法实现（零 DOM 依赖，可独立单测）
// 用两点连线（割线）近似切线求 f(x)=0 的根，无需导数，收敛阶约 1.618。
// =============================================================================

/** 一轮割线法的信息。 */
export interface SecantStep {
  iter: number;
  /** 当前点 x_n。 */
  x: number;
  /** 函数值 f(x_n)。 */
  fx: number;
  /** 下一个估计 x_{n+1}。 */
  next: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SecantHooks {
  onIter?: (step: SecantStep) => void;
}

/** 割线法返回结果。 */
export interface SecantResult {
  root: number;
  iterations: number;
  converged: boolean;
  steps: SecantStep[];
}

/**
 * 割线法求 `f(x) = 0` 的根。
 *
 * 用过 `(x_{n-1}, f(x_{n-1}))` 与 `(x_n, f(x_n))` 的**割线**代替切线，
 * 取割线与 x 轴的交点作为下一个估计：
 *
 * `x_{n+1} = x_n − f(x_n) · (x_n − x_{n-1}) / (f(x_n) − f(x_{n-1}))`
 *
 * 相比牛顿法**无需导数**，每轮只需一次函数求值；收敛阶约 **1.618**（黄金比），
 * 介于牛顿法（2）与二分法（1）之间。
 *
 * - 需要两个初始点 x0、x1（不必同号，不像二分法要求变号区间）
 * - 当 `f(x_n) ≈ f(x_{n-1})`（割线几乎水平）时停止以免除零
 *
 * 时间复杂度 `O(k)`，空间 `O(k)`。
 *
 * @param f 目标函数
 * @param x0 第一个初值
 * @param x1 第二个初值
 * @param options 容差与最大迭代数
 * @param hooks 可选的事件钩子
 */
export function secant(
  f: (x: number) => number,
  x0: number,
  x1: number,
  options: { tol?: number; maxIter?: number } = {},
  hooks: SecantHooks = {},
): SecantResult {
  const { tol = 1e-12, maxIter = 100 } = options;
  const steps: SecantStep[] = [];
  let prev = x0;
  let cur = x1;
  let fPrev = f(prev);
  let fCur = f(cur);
  for (let iter = 0; iter < maxIter; iter++) {
    const denom = fCur - fPrev;
    if (Math.abs(denom) < 1e-300) {
      // 割线几乎水平，无法继续
      return { root: cur, iterations: iter, converged: Math.abs(fCur) <= tol, steps };
    }
    const next = cur - (fCur * (cur - prev)) / denom;
    const step: SecantStep = { iter, x: cur, fx: fCur, next };
    steps.push(step);
    hooks.onIter?.(step);
    if (Math.abs(next - cur) <= tol * (1 + Math.abs(next)) || Math.abs(fCur) <= tol) {
      return { root: next, iterations: iter + 1, converged: true, steps };
    }
    prev = cur;
    fPrev = fCur;
    cur = next;
    fCur = f(cur);
  }
  return { root: cur, iterations: maxIter, converged: false, steps };
}
