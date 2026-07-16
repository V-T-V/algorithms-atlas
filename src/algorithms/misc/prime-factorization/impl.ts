// 质因数分解 · 纯算法实现

/** 一个质因子及其幂次。 */
export interface PrimeFactor {
  prime: number;
  exponent: number;
}

/** 事件钩子。 */
export interface PrimeFactorizationHooks {
  /** 找到一个质因子 prime，当前已除尽 exponent 次。 */
  onFactor?: (prime: number, exponent: number, remaining: number) => void;
  /** 试除 d 失败（d 不是因子）。 */
  onSkip?: (d: number, remaining: number) => void;
  /** 分解完成。 */
  onResult?: (factors: PrimeFactor[]) => void;
}

/**
 * 质因数分解（试除法）。
 * @param n 待分解的整数（n >= 2）
 * @returns 质因子列表（按 prime 升序，含 exponent）
 */
export function primeFactorization(n: number, hooks: PrimeFactorizationHooks = {}): PrimeFactor[] {
  if (!Number.isInteger(n) || n < 2) {
    throw new RangeError('n must be an integer >= 2');
  }
  const factors: PrimeFactor[] = [];
  let remaining = n;

  // 处理 2
  if (remaining % 2 === 0) {
    let exp = 0;
    while (remaining % 2 === 0) {
      exp++;
      remaining = Math.floor(remaining / 2);
    }
    factors.push({ prime: 2, exponent: exp });
    hooks.onFactor?.(2, exp, remaining);
  }
  // 处理奇数 d = 3,5,7,...
  for (let d = 3; d * d <= remaining; d += 2) {
    if (remaining % d === 0) {
      let exp = 0;
      while (remaining % d === 0) {
        exp++;
        remaining = Math.floor(remaining / d);
      }
      factors.push({ prime: d, exponent: exp });
      hooks.onFactor?.(d, exp, remaining);
    } else {
      hooks.onSkip?.(d, remaining);
    }
  }
  // 剩余大于 1 → 自身为质因子
  if (remaining > 1) {
    factors.push({ prime: remaining, exponent: 1 });
    hooks.onFactor?.(remaining, 1, 1);
  }
  hooks.onResult?.([...factors]);
  return factors;
}

/** 把因子列表乘回原数（用于校验）。 */
export function productOf(factors: PrimeFactor[]): number {
  let p = 1;
  for (const f of factors) p *= f.prime ** f.exponent;
  return p;
}
