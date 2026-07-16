// =============================================================================
// 完全数判定 · 纯算法实现
// 真因数之和 == n。用 √n 成对枚举优化。零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface PerfectNumberHooks {
  /** 找到一对因数 (d, n/d) 时触发（d != n/d 才两个都计入）。 */
  onDivisor?: (d: number, pair: number | null, partialSum: number) => void;
  /** 最终判定。 */
  onResult?: (n: number, sum: number, isPerfect: boolean) => void;
}

/**
 * 判定正整数 n 是否为完全数。
 * 用遍历到 √n 的方式成对累加真因数。
 */
export function isPerfectNumber(n: number, hooks: PerfectNumberHooks = {}): boolean {
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError('n must be a positive integer');
  }
  if (n === 1) {
    // 1 的真因数为空，和 = 0 ≠ 1，不是完全数
    hooks.onResult?.(1, 0, false);
    return false;
  }
  let sum = 1; // 1 是所有 n>1 的真因数
  hooks.onDivisor?.(1, null, sum);
  const limit = Math.floor(Math.sqrt(n));
  for (let d = 2; d <= limit; d++) {
    if (n % d === 0) {
      sum += d;
      const pair = n / d;
      if (pair !== d && pair !== n) {
        sum += pair;
        hooks.onDivisor?.(d, pair, sum);
      } else {
        hooks.onDivisor?.(d, null, sum);
      }
    }
  }
  const ok = sum === n;
  hooks.onResult?.(n, sum, ok);
  return ok;
}

/** 枚举 n 的所有真因数（朴素，用于校验）。 */
export function properDivisors(n: number): number[] {
  if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be a positive integer');
  const out: number[] = [];
  for (let d = 1; d < n; d++) {
    if (n % d === 0) out.push(d);
  }
  return out;
}

/** 真因数之和（朴素实现，用于校验）。 */
export function sumProperDivisors(n: number): number {
  return properDivisors(n).reduce((a, b) => a + b, 0);
}
