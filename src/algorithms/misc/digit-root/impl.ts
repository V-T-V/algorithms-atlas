// 数根 · 纯算法实现

/** 事件钩子。 */
export interface DigitRootHooks {
  /** 一轮求和：当前数 x → 各位和 s。 */
  onRound?: (round: number, x: number, s: number) => void;
  /** 最终数根。 */
  onResult?: (n: number, root: number) => void;
}

/** 计算非负整数 x 的各位数字之和。 */
export function digitSum(x: number): number {
  let s = 0;
  while (x > 0) {
    s += x % 10;
    x = Math.floor(x / 10);
  }
  return s;
}

/**
 * 数根（迭代法）：反复求各位和直至一位。
 */
export function digitalRoot(n: number, hooks: DigitRootHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }
  let x = n;
  let round = 0;
  while (x >= 10) {
    round++;
    const s = digitSum(x);
    hooks.onRound?.(round, x, s);
    x = s;
  }
  hooks.onResult?.(n, x);
  return x;
}

/**
 * 数根（公式法，O(1)）：dr(n) = n===0 ? 0 : 1 + (n-1) % 9。
 */
export function digitalRootFormula(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }
  if (n === 0) return 0;
  return 1 + ((n - 1) % 9);
}
