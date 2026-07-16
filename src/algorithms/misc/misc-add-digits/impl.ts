// =============================================================================
// 反复加位数 · 纯算法实现
// =============================================================================

export interface AddDigitsHooks {
  onIter?: (cur: number, sum: number) => void;
}

/** 模拟：反复求各位和。 */
export function addDigits(num: number, hooks: AddDigitsHooks = {}): number {
  if (num < 0 || !Number.isInteger(num)) {
    throw new Error(`num 必须 >= 0 的整数 / must be a non-negative integer, got ${num}`);
  }
  let cur = num;
  while (cur >= 10) {
    let sum = 0;
    for (const d of cur.toString()) sum += Number(d);
    hooks.onIter?.(cur, sum);
    cur = sum;
  }
  return cur;
}

/** 数学公式版（O(1)）。 */
export function addDigitsFormula(num: number): number {
  if (num <= 0) return 0;
  return 1 + ((num - 1) % 9);
}
