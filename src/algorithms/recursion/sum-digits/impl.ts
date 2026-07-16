// 递归求数字各位和 · 纯算法实现

/** 事件钩子。 */
export interface SumDigitsHooks {
  /** 进入一层 sumDigits(n)，本层取末位 digit。 */
  onRecurse?: (n: number, digit: number, depth: number) => void;
  /** 基例 n == 0。 */
  onBase?: (depth: number) => void;
  /** 本层返回 partial（子结果）+ digit = result。 */
  onCombine?: (n: number, digit: number, partial: number, result: number, depth: number) => void;
}

/**
 * 递归求非负整数 n 各位数字之和。
 */
export function sumDigits(n: number, hooks: SumDigitsHooks = {}, depth = 0): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('sumDigits requires a non-negative integer');
  }
  if (n === 0) {
    if (depth === 0) {
      hooks.onRecurse?.(0, 0, 0);
      hooks.onBase?.(0);
    } else {
      hooks.onBase?.(depth);
    }
    return 0;
  }
  const digit = n % 10;
  hooks.onRecurse?.(n, digit, depth);
  const partial = sumDigits(Math.floor(n / 10), hooks, depth + 1);
  const result = partial + digit;
  hooks.onCombine?.(n, digit, partial, result, depth);
  return result;
}
