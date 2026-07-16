// =============================================================================
// 阶乘尾零 · 纯算法实现
// =============================================================================

export interface TrailingZeroHooks {
  onTerm?: (divisor: number, term: number, acc: number) => void;
}

export function trailingZeroes(n: number, hooks: TrailingZeroHooks = {}): number {
  if (n < 0) throw new Error(`n 必须 >= 0 / must be >= 0, got ${n}`);
  let count = 0;
  let divisor = 5;
  while (divisor <= n) {
    const term = Math.floor(n / divisor);
    count += term;
    hooks.onTerm?.(divisor, term, count);
    divisor *= 5;
  }
  return count;
}

/** 暴力计算 n! 然后数尾零（验证用，仅小 n）。 */
export function trailingZeroesBrute(n: number): number {
  if (n < 0) throw new Error(`n 必须 >= 0 / must be >= 0, got ${n}`);
  let fact = 1n;
  for (let i = 2n; i <= BigInt(n); i++) fact *= i;
  let zeros = 0;
  const s = fact.toString();
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === '0') zeros++;
    else break;
  }
  return zeros;
}
