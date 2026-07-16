// =============================================================================
// 第 N 位数字 · 纯算法实现
// =============================================================================

export interface NthDigitHooks {
  onGroup?: (digits: number, count: number, start: number) => void;
  onLocate?: (number: number, digitIndex: number, digit: number) => void;
}

export function findNthDigit(n: number, hooks: NthDigitHooks = {}): number {
  if (n < 1) throw new Error(`n 必须 >= 1 / n must be >= 1, got ${n}`);
  let len = 1;
  let count = 9;
  let start = 1;
  let remaining = n;
  while (remaining > len * count) {
    hooks.onGroup?.(len, count, start);
    remaining -= len * count;
    len++;
    count *= 10;
    start *= 10;
  }
  const numIndex = Math.floor((remaining - 1) / len);
  const digitIndex = (remaining - 1) % len;
  const number = start + numIndex;
  const digit = Number(number.toString()[digitIndex]!);
  hooks.onLocate?.(number, digitIndex, digit);
  return digit;
}
