// 第 K 个语法符号（LeetCode 779）· 纯算法实现

/** 事件钩子。 */
export interface KthSymbolHooks {
  /** 递归进入第 n 行第 k 位。 */
  onRecurse?: (n: number, k: number, half: 'first' | 'second', depth: number) => void;
  /** 基线命中（n=1 返回 0）。 */
  onBase?: () => void;
  /** 某层返回（给出该层结果与是否翻转）。 */
  onReturn?: (n: number, value: 0 | 1, flipped: boolean, depth: number) => void;
}

/**
 * 第 K 个语法符号。
 *
 * @param n 行号（>=1）
 * @param k 第 k 位（1-based，1 <= k <= 2^(n-1)）
 * @param hooks 可选事件钩子
 * @returns 0 或 1
 */
export function kthSymbol(
  n: number,
  k: number,
  hooks: KthSymbolHooks = {},
  depth: number = 0,
): 0 | 1 {
  if (!Number.isInteger(n) || n < 1) throw new RangeError(`n 须 >=1: ${n}`);
  if (!Number.isInteger(k) || k < 1) throw new RangeError(`k 须 >=1: ${k}`);

  if (n === 1) {
    hooks.onBase?.();
    return 0;
  }
  const halfLen = 1 << (n - 2); // 2^(n-2)
  if (k <= halfLen) {
    hooks.onRecurse?.(n, k, 'first', depth);
    const v = kthSymbol(n - 1, k, hooks, depth + 1);
    hooks.onReturn?.(n, v, false, depth);
    return v;
  }
  // 后半：递归 (n-1, k - halfLen) 并翻转
  hooks.onRecurse?.(n, k, 'second', depth);
  const v = kthSymbol(n - 1, k - halfLen, hooks, depth + 1);
  const flipped = (v === 0 ? 1 : 0) as 0 | 1;
  hooks.onReturn?.(n, flipped, true, depth);
  return flipped;
}
