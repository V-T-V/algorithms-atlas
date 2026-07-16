// =============================================================================
// 多项式求值（Polynomial Evaluation，含导数）· 纯算法实现（零 DOM 依赖，可独立单测）
// 基于 Horner 方案同时求多项式 p(x) 与其导数 p'(x)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PolynomialEvalHooks {
  /** 每处理一个系数后当前的 p 累积值与 p' 累积值。step 从 0 起。 */
  onStep?: (step: number, valueAcc: number, derivAcc: number) => void;
}

/** 多项式求值结果：函数值与导数值。 */
export interface PolynomialEvalResult {
  /** p(x)。 */
  value: number;
  /** p'(x)。 */
  derivative: number;
}

/**
 * 同时求多项式 `p(x)` 与导数 `p'(x)`（Horner 并发求值）。
 *
 * 多项式 `p(x) = a_0 x^n + a_1 x^{n-1} + … + a_n`（coeffs 降幂）。
 * - 值：`acc = acc·x + a_k`
 * - 导数：在求值的同时维护 `dAcc = dAcc·x + acc`（在累加最新 acc 之前），
 *   最终 dAcc 即 p'(x)
 *
 * 等价于对系数做一次综合除法：得到 `p(x)` 与降一次的商多项式，
 * 再对该商用 Horner 求值即导数。这里把两次合成一遍循环。
 *
 * - `polynomialEval([2, -6, 2, -1], 3)` → `{ value: 5, derivative: 20 }`
 *   （p=2x³−6x²+2x−1，p(3)=5；p'=6x²−12x+2，p'(3)=6·9−12·3+2=20）
 *
 * 空系数返回 `{ value: 0, derivative: 0 }`；单系数返回 `{ value: a_0, derivative: 0 }`。
 *
 * 时间复杂度 `O(n)`，空间 `O(1)`。
 *
 * @param coeffs 多项式系数（降幂）
 * @param x 求值点
 * @param hooks 可选的事件钩子
 */
export function polynomialEval(
  coeffs: readonly number[],
  x: number,
  hooks: PolynomialEvalHooks = {},
): PolynomialEvalResult {
  if (coeffs.length === 0) return { value: 0, derivative: 0 };
  let value = coeffs[0]!;
  let deriv = 0;
  hooks.onStep?.(0, value, deriv);
  for (let k = 1; k < coeffs.length; k++) {
    deriv = deriv * x + value; // 先把当前值并入导数累积
    value = value * x + coeffs[k]!;
    hooks.onStep?.(k, value, deriv);
  }
  return { value, derivative: deriv };
}
