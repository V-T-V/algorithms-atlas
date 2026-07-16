// =============================================================================
// Brent 方法（Brent's Method / Brent–Dekker）· 纯算法实现（零 DOM 依赖，可独立单测）
// 在保持二分法稳健性的前提下，尽量用逆二次插值加速求 f(x)=0 的根。
// =============================================================================

/** 一轮 Brent 方法的信息。 */
export interface BrentStep {
  iter: number;
  /** 当前区间左端 a（f(a) 与 f(b) 异号）。 */
  a: number;
  /** 当前工作点 b（最佳近似）。 */
  b: number;
  /** 上一步的 b（用于判断是否收敛）。 */
  c: number;
  /** 本轮采用的方法：'iqi'（逆二次插值）/ 'secant'（割线）/ 'bisection'（二分）。 */
  method: 'iqi' | 'secant' | 'bisection';
  /** 本轮得到的新点 s。 */
  s: number;
  /** f(b)。 */
  fb: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BrentHooks {
  onStep?: (step: BrentStep) => void;
}

/** Brent 方法返回结果。 */
export interface BrentResult {
  root: number;
  iterations: number;
  converged: boolean;
  steps: BrentStep[];
}

/**
 * Brent 方法求 `f(x) = 0` 在变号区间 `[a, b]` 内的根。
 *
 * 核心：始终保持 `f(a)·f(b) < 0`（根被夹住，**保证收敛**），
 * 同时尽量用**逆二次插值（IQI）**或**割线**快速逼近：
 *
 * 1. 尝试 IQI：用 a、b、c 三点拟合抛物线取其与 x 轴交点 s
 * 2. 若 IQI 不满足安全条件（s 不在区间内，或步长退化），退化为割线
 * 3. 若割线仍不安全，退化为二分（中点）
 *
 * 兼具**二分法的稳健性**与**高阶方法的超线性收敛**，是工程上求根的「金标准」。
 *
 * 要求 `f(a)·f(b) < 0`（变号），否则抛错。
 *
 * - 在 `[1, 2]` 上解 `x² − 2 = 0` → √2
 *
 * 时间复杂度 `O(k)`，空间 `O(k)`。
 *
 * @param f 目标函数
 * @param a 区间左端
 * @param b 区间右端
 * @param options 容差与最大迭代数
 * @param hooks 可选的事件钩子
 */
export function brent(
  f: (x: number) => number,
  a: number,
  b: number,
  options: { tol?: number; maxIter?: number } = {},
  hooks: BrentHooks = {},
): BrentResult {
  const { tol = 1e-12, maxIter = 100 } = options;
  let fa = f(a);
  let fb = f(b);
  if (fa === 0) return { root: a, iterations: 0, converged: true, steps: [] };
  if (fb === 0) return { root: b, iterations: 0, converged: true, steps: [] };
  if (fa * fb > 0) throw new Error('需要 f(a) 与 f(b) 异号的变号区间');

  const steps: BrentStep[] = [];
  let c = a;
  let fc = fa;
  let d = b - c; // 上一步的步长（初值任意 > tol）
  let mflag = true;

  for (let iter = 0; iter < maxIter; iter++) {
    if (Math.abs(fc) < Math.abs(fb)) {
      // 交换使 b 始终是最佳近似
      [a, b, c] = [b, c, b];
      [fa, fb, fc] = [fb, fc, fb];
    }
    const tolAct = 2 * Number.EPSILON * Math.abs(b) + tol / 2;
    const delta = (b - c) / 2;
    let s: number;
    let method: 'iqi' | 'secant' | 'bisection';

    if (Math.abs(delta) <= tolAct || fb === 0) {
      // 已收敛
      return { root: b, iterations: iter, converged: true, steps };
    }

    const useIqi = fa !== fc && fb !== fc;
    const useSecant = !useIqi && fa !== fb;

    if (useIqi) {
      // 逆二次插值
      s =
        (a * fb * fc) / ((fa - fb) * (fa - fc)) +
        (b * fa * fc) / ((fb - fa) * (fb - fc)) +
        (c * fa * fb) / ((fc - fa) * (fc - fb));
      method = 'iqi';
    } else if (useSecant) {
      // 割线
      s = b - (fb * (b - a)) / (fb - fa);
      method = 'secant';
    } else {
      s = (a + b) / 2;
      method = 'bisection';
    }

    // 安全条件：若 s 不在合理范围，退化为二分
    const lo = Math.min((3 * a + b) / 4, b);
    const hi = Math.max((3 * a + b) / 4, b);
    const cond1 = !(s >= lo && s <= hi);
    const cond2 = mflag && Math.abs(s - b) >= Math.abs(b - c) / 2;
    const cond3 = !mflag && Math.abs(s - b) >= Math.abs(c - d) / 2;
    const cond4 = mflag && Math.abs(b - c) <= tolAct;
    const cond5 = !mflag && Math.abs(c - d) <= tolAct;
    if (cond1 || cond2 || cond3 || cond4 || cond5) {
      s = (a + b) / 2;
      method = 'bisection';
      mflag = true;
    } else {
      mflag = false;
    }

    const fs = f(s);
    d = c; // 记录上一步的 c（成为新的「上上步」）
    c = b;
    fc = fb;
    const step: BrentStep = { iter, a, b, c, method, s, fb };
    steps.push(step);
    hooks.onStep?.(step);
    if (fs === 0 || Math.abs(s - b) <= tolAct) {
      return { root: s, iterations: iter + 1, converged: true, steps };
    }
    if (fa * fs < 0) {
      b = s;
      fb = fs;
    } else {
      a = s;
      fa = fs;
      b = c; // b 保持为最佳近似
      fb = fc;
      c = a;
      fc = fa;
    }
  }
  return { root: b, iterations: maxIter, converged: false, steps };
}
