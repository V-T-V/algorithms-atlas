// =============================================================================
// 二分法求根（Bisection Method）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 一轮二分探测的信息。 */
export interface BisectionStep {
  /** 迭代号，从 1 开始。 */
  iter: number;
  /** 当前区间左端点。 */
  lo: number;
  /** 当前区间右端点。 */
  hi: number;
  /** 本轮探测的中点。 */
  mid: number;
  /** 中点函数值。 */
  fmid: number;
  /** 本轮后新的区间：f(lo) 与 f(mid) 异号则 [lo, mid]，否则 [mid, hi]。 */
  newLo: number;
  newHi: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BisectionHooks {
  /** 计算中点函数值后触发。 */
  onProbe?: (mid: number, fmid: number) => void;
  /** 区间收缩后触发：给出本轮 step 信息。 */
  onShrink?: (step: BisectionStep) => void;
}

/** 二分法返回结果。 */
export interface BisectionResult {
  /** 求得的近似根。 */
  root: number;
  /** 迭代轮数。 */
  iterations: number;
  /** 是否在 maxIter 内达到容差。 */
  converged: boolean;
  /** 最终区间宽度。 */
  width: number;
  /** 每轮迭代信息。 */
  steps: BisectionStep[];
}

/**
 * 二分法求根：在区间 `[lo, hi]` 上求连续函数 `f` 的根（`f(x) = 0`）。
 *
 * 前提：`f(lo)` 与 `f(hi)` 异号（由介值定理保证区间内必有根）。
 *
 * 每轮取中点 `mid = (lo + hi) / 2`，计算 `f(mid)`：
 * - 若 `f(mid) == 0` 或区间足够窄，返回 mid；
 * - 若 `f(lo)` 与 `f(mid)` 异号，根在 `[lo, mid]`，令 `hi = mid`；
 * - 否则根在 `[mid, hi]`，令 `lo = mid`。
 *
 * 每轮区间宽度减半，故 `n` 轮后宽度为 `(hi - lo) / 2ⁿ`。
 * 收敛速度线性（比牛顿法慢），但**稳健可靠**——只要初值区间合法就一定收敛，
 * 且不需要导数。时间 `O(log((hi - lo) / tol))`，空间 `O(1)`。
 *
 * @param f 连续函数
 * @param lo 区间左端点
 * @param hi 区间右端点
 * @param options 容差与最大迭代次数
 * @param hooks 可选的事件钩子
 */
export function bisection(
  f: (x: number) => number,
  lo: number,
  hi: number,
  options: { tol?: number; maxIter?: number } = {},
  hooks: BisectionHooks = {},
): BisectionResult {
  const { tol = 1e-12, maxIter = 200 } = options;
  const steps: BisectionStep[] = [];

  const flo = f(lo);
  const fhi = f(hi);
  if (flo === 0) return { root: lo, iterations: 0, converged: true, width: 0, steps };
  if (fhi === 0) return { root: hi, iterations: 0, converged: true, width: 0, steps };
  if (flo * fhi > 0) {
    // 同号：不满足介值定理前提
    return { root: NaN, iterations: 0, converged: false, width: hi - lo, steps };
  }

  let a = lo;
  let b = hi;
  let fa = flo;
  let mid = a;
  for (let iter = 1; iter <= maxIter; iter++) {
    mid = (a + b) / 2;
    const fmid = f(mid);
    hooks.onProbe?.(mid, fmid);

    // 决定新区间
    let newLo: number;
    let newHi: number;
    if (fmid === 0) {
      newLo = mid;
      newHi = mid;
    } else if (fa * fmid < 0) {
      // f(a) 与 f(mid) 异号 → 根在 [a, mid]
      newLo = a;
      newHi = mid;
    } else {
      // 根在 [mid, b]
      newLo = mid;
      newHi = b;
      fa = fmid; // 更新 f(a) 为原 mid 处
    }

    const step: BisectionStep = { iter, lo: a, hi: b, mid, fmid, newLo, newHi };
    steps.push(step);
    hooks.onShrink?.(step);

    a = newLo;
    b = newHi;

    // 收敛判据：区间宽度或残差足够小
    if (b - a <= tol || Math.abs(fmid) <= tol) {
      return { root: (a + b) / 2, iterations: iter, converged: true, width: b - a, steps };
    }
  }
  return { root: mid, iterations: maxIter, converged: false, width: b - a, steps };
}
