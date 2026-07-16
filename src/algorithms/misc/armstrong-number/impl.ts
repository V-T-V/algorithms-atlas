// 水仙花数判定 · 纯算法实现

/** 事件钩子。 */
export interface ArmstrongHooks {
  /** 确定位数 n。 */
  onDigits?: (n: number, numDigits: number) => void;
  /** 处理某一位 digit，累加其 numDigits 次幂 partial。 */
  onDigit?: (digit: number, power: number, partial: number) => void;
  /** 最终比较结论。 */
  onResult?: (n: number, sum: number, isArmstrong: boolean) => void;
}

/** 计算非负整数的十进制位数。 */
export function digitCount(n: number): number {
  if (n === 0) return 1;
  return Math.floor(Math.log10(n)) + 1;
}

/**
 * 判定非负整数 n 是否为水仙花数（Armstrong number）。
 */
export function isArmstrongNumber(n: number, hooks: ArmstrongHooks = {}): boolean {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }
  const d = digitCount(n);
  hooks.onDigits?.(n, d);

  let sum = 0;
  let x = n;
  while (x > 0) {
    const digit = x % 10;
    const power = digit ** d;
    sum += power;
    hooks.onDigit?.(digit, power, sum);
    x = Math.floor(x / 10);
  }
  const ok = sum === n;
  hooks.onResult?.(n, sum, ok);
  return ok;
}
