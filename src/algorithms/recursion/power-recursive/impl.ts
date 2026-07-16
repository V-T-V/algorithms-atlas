// 递归快速幂 · 纯算法实现

/** 事件钩子。 */
export interface PowerRecursiveHooks {
  /** 进入递归 power(base, exp)。 */
  onRecurse?: (base: number, exp: number, depth: number) => void;
  /** 命中基例 exp == 0。 */
  onBase?: (depth: number) => void;
  /** 子结果 sub 返回，本层做平方或平方×base 得到本层结果。 */
  onCombine?: (exp: number, sub: number, result: number, depth: number) => void;
}

/**
 * 递归快速幂：计算 base^exp（exp 为非负整数）。
 * 可选 mod 给出模意义下的幂（结果恒 < mod）。
 */
export function powerRecursive(
  base: number,
  exp: number,
  mod?: number,
  hooks: PowerRecursiveHooks = {},
  depth = 0,
): number {
  if (!Number.isInteger(exp) || exp < 0) {
    throw new RangeError('exp must be a non-negative integer');
  }
  if (mod !== undefined) {
    base = ((base % mod) + mod) % mod;
  }
  hooks.onRecurse?.(base, exp, depth);
  if (exp === 0) {
    hooks.onBase?.(depth);
    return mod === undefined ? 1 : 1 % mod;
  }
  const half = powerRecursive(base, Math.floor(exp / 2), mod, hooks, depth + 1);
  let result: number;
  if (mod === undefined) {
    result = half * half;
    if (exp % 2 === 1) result *= base;
  } else {
    result = (half * half) % mod;
    if (exp % 2 === 1) result = (result * base) % mod;
  }
  hooks.onCombine?.(exp, half, result, depth);
  return result;
}
