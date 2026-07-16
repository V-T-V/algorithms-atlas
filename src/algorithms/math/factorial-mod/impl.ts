// =============================================================================
// 阶乘取模 Factorial Mod · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FactorialModHooks {
  /** 累乘一步：当前 i，结果 prod = i! mod m。 */
  onStep?: (i: number, prod: number) => void;
  /** 最终结果 n! mod m。 */
  onResult?: (result: number) => void;
}

/**
 * 阶乘取模 `n! mod m`。
 *
 * 原理：逐项累乘 `1·2·…·n`，每步对 `m` 取模以避免溢出。用 BigInt 保证中间精确。
 *
 * 优化场景：若 `n ≥ m`，则 `n!` 必含因子 `m`，结果为 0（仅当 m 为素数时严格成立；
 * 一般情形需更细致判定，本实现仍逐项计算，结果正确）。
 *
 * - 时间 `O(n)`，空间 `O(1)`
 *
 * @param n 非负整数
 * @param m 模数（正整数）
 * @param hooks 可选的事件钩子
 * @returns `n! mod m`
 */
export function factorialMod(n: number, m: number, hooks: FactorialModHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('factorialMod: n must be non-negative');
  if (!Number.isInteger(m) || m <= 0) throw new RangeError('factorialMod: m must be positive');
  const M = BigInt(m);
  let prod = 1n % M;
  hooks.onStep?.(0, Number(prod));
  // 若 n >= m 且 m 为素数则可提前返回 0；这里保留逐项精确计算
  for (let i = 1; i <= n; i++) {
    prod = (prod * BigInt(i)) % M;
    if (prod === 0n) {
      hooks.onStep?.(i, 0);
      hooks.onResult?.(0);
      return 0;
    }
    hooks.onStep?.(i, Number(prod));
  }
  hooks.onResult?.(Number(prod));
  return Number(prod);
}
