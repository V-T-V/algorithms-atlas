// =============================================================================
// 雅可比符号 Jacobi Symbol J(a, n) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface JacobiHooks {
  /** 一轮化简：当前 (a, n) 与部分符号 s（±1）。 */
  onStep?: (a: number, n: number, s: number) => void;
  /** 最终结果 J(a, n) ∈ {-1, 0, 1}。 */
  onResult?: (value: number) => void;
}

/**
 * 雅可比符号 `J(a, n)`（`n` 为**奇正整数**）。
 *
 * 取值 `{-1, 0, 1}`，定义基于勒让德符号的推广（对合数模也成立）：
 * - `J(a, n) = 0` 当 `gcd(a, n) ≠ 1`
 * - 否则由二次互反律反复化简，类似欧几里得算法：
 *   1. 把 `a` 中因子 2 提出：`J(2, n) = (-1)^((n²-1)/8)`
 *   2. 二次互反律：`J(a, n) = (-1)^((a-1)(n-1)/4) · J(n mod a, a)`（a, n 奇）
 *
 * - 时间 `O(log n)`（与欧几里得算法同阶）
 * - 空间 `O(1)`
 *
 * @param a 整数
 * @param n 奇正整数（>0）
 * @param hooks 可选的事件钩子
 * @returns `J(a, n) ∈ {-1, 0, 1}`
 */
export function jacobi(a: number, n: number, hooks: JacobiHooks = {}): number {
  if (!Number.isInteger(n) || n <= 0 || n % 2 === 0) {
    throw new RangeError('jacobi: n must be a positive odd integer');
  }
  // 规范化 a 到 [0, n)
  let x = ((a % n) + n) % n;
  let nn = n;
  let s = 1;

  while (x !== 0) {
    // 提出 x 中所有因子 2
    while (x % 2 === 0) {
      x /= 2;
      // J(2, nn) = (-1)^((nn²-1)/8)
      const r = nn % 8;
      if (r === 3 || r === 5) s = -s;
    }
    // 此时 x 为奇
    // 互反律：交换 x 与 nn，视 x mod 4 与 nn mod 4
    if (x % 4 === 3 && nn % 4 === 3) s = -s;
    [x, nn] = [nn % x, x];
    hooks.onStep?.(x, nn, s);
  }
  const result = nn === 1 ? s : 0;
  hooks.onResult?.(result);
  return result;
}
