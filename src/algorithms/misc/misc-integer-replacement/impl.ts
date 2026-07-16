// =============================================================================
// 整数替换 · 纯算法实现
// =============================================================================

export interface IntReplHooks {
  onStep?: (cur: number, op: string, next: number) => void;
}

export function integerReplacement(n: number, hooks: IntReplHooks = {}): number {
  if (n < 1 || !Number.isInteger(n)) {
    throw new Error(`n 必须 >= 1 的整数 / n must be a positive integer, got ${n}`);
  }
  let cur = n;
  let steps = 0;
  while (cur !== 1) {
    if (cur % 2 === 0) {
      cur /= 2;
      hooks.onStep?.(cur * 2, '/2', cur);
    } else if (cur === 3) {
      cur -= 1;
      hooks.onStep?.(3, '-1', cur);
    } else if (cur % 4 === 1) {
      cur -= 1;
      hooks.onStep?.(cur + 1, '-1', cur);
    } else {
      cur += 1;
      hooks.onStep?.(cur - 1, '+1', cur);
    }
    steps++;
  }
  return steps;
}

/** 暴力递归版（用于验证贪心策略正确性）。 */
export function integerReplacementBrute(n: number): number {
  if (n === 1) return 0;
  if (n % 2 === 0) return 1 + integerReplacementBrute(n / 2);
  return 1 + Math.min(integerReplacementBrute(n - 1), integerReplacementBrute(n + 1));
}
