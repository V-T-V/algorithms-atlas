// =============================================================================
// 秦九韶算法（Horner's Method / Horner Scheme）· 纯算法实现（零 DOM 依赖，可独立单测）
// 用最少的乘法/加法求多项式 p(x) = a_n x^n + … + a_1 x + a_0 在某点的值。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HornerHooks {
  /** 每处理一个系数后当前累积值 acc。step 从 0 起对应系数 a_0…a_{n-1}。 */
  onStep?: (step: number, acc: number) => void;
}

/**
 * 秦九韶算法（Horner scheme）求多项式值。
 *
 * 多项式 `p(x) = a_0 x^n + a_1 x^{n-1} + … + a_{n-1} x + a_n`
 * （coeffs 按降幂排列）改写为嵌套形式：
 *
 * `p(x) = (((a_0)·x + a_1)·x + a_2)·x + … + a_n`
 *
 * 从 `acc = a_0` 起，重复 `acc = acc·x + a_k`。仅需 n 次乘法、n 次加法，
 * 是求多项式值的最优方法（且数值稳定性优于按项直接累加）。
 *
 * - `horner([2, -6, 2, -1], 3)` = `2·27 − 6·9 + 2·3 − 1 = 11`
 * - `horner([1, 0, 0, 0, 1], 1)` = 2（x⁴+1 在 x=1）
 *
 * 空系数数组约定返回 0。
 *
 * 时间复杂度 `O(n)`，空间 `O(1)`。
 *
 * @param coeffs 多项式系数（降幂：`[a_0, a_1, …, a_n]`）
 * @param x 求值点
 * @param hooks 可选的事件钩子
 */
export function horner(coeffs: readonly number[], x: number, hooks: HornerHooks = {}): number {
  if (coeffs.length === 0) return 0;
  let acc = coeffs[0]!;
  hooks.onStep?.(0, acc);
  for (let k = 1; k < coeffs.length; k++) {
    acc = acc * x + coeffs[k]!;
    hooks.onStep?.(k, acc);
  }
  return acc;
}
