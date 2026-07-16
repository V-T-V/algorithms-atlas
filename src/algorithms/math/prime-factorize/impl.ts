// =============================================================================
// 质因数分解 Prime Factorization · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 一个质因子项：质数 p 及其在分解中出现的指数 k。 */
export interface PrimeFactor {
  prime: number;
  exp: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PrimeFactorizeHooks {
  /** 尝试用 d 作为候选因子（d 从小到大扫描，含合数但合数必不能整除）。 */
  onTry?: (n: number, d: number) => void;
  /** 发现一个质因子 p，并累计到指数 k。 */
  onFactor?: (remaining: number, p: number, exp: number) => void;
  /** 一个质因子项已确定（p 及其完整指数 k）。 */
  onFactorComplete?: (p: number, exp: number) => void;
  /** 完成。 */
  onDone?: (n: number, factors: PrimeFactor[]) => void;
}

/**
 * 质因数分解（试除法）：把 `n ≥ 2` 分解为 `p1^k1 · p2^k2 · ...`。
 *
 * 步骤：\n
 * 1. 先把所有 2 抽出（让后续只扫奇数）\n
 * 2. 对 `d = 3, 5, 7, …` 直到 `d·d ≤ m`：若 `d | m`，反复除尽并计数\n
 * 3. 若最后 `m > 1`，剩下的 `m` 是一个大于 `√n` 的质因子\n
 *
 * 复杂度 `O(√n)`。返回质因子项数组（按 prime 升序）。
 *
 * @param n 待分解整数（n ≥ 2）
 * @returns 质因子项数组 `[{prime, exp}, ...]`
 */
export function primeFactorize(n: number, hooks: PrimeFactorizeHooks = {}): PrimeFactor[] {
  if (n < 2) throw new RangeError('primeFactorize: n must be ≥ 2');
  const factors: PrimeFactor[] = [];
  let m = n;

  // 抽 2
  if (m % 2 === 0) {
    let exp = 0;
    hooks.onTry?.(m, 2);
    while (m % 2 === 0) {
      m = Math.trunc(m / 2);
      exp++;
      hooks.onFactor?.(m, 2, exp);
    }
    factors.push({ prime: 2, exp });
    hooks.onFactorComplete?.(2, exp);
  }

  // 抽奇数因子
  for (let d = 3; d * d <= m; d += 2) {
    if (m % d === 0) {
      let exp = 0;
      hooks.onTry?.(m, d);
      while (m % d === 0) {
        m = Math.trunc(m / d);
        exp++;
        hooks.onFactor?.(m, d, exp);
      }
      factors.push({ prime: d, exp });
      hooks.onFactorComplete?.(d, exp);
    }
  }

  // 剩下的 > 1 即最后一个质因子
  if (m > 1) {
    hooks.onTry?.(m, m);
    hooks.onFactor?.(1, m, 1);
    factors.push({ prime: m, exp: 1 });
    hooks.onFactorComplete?.(m, 1);
  }

  hooks.onDone?.(n, factors);
  return factors;
}

/**
 * 把质因子项数组格式化为 `p1^k1 · p2^k2 · ...` 字符串（指数为 1 时省略）。
 */
export function formatFactors(factors: PrimeFactor[]): string {
  return factors.map((f) => (f.exp === 1 ? `${f.prime}` : `${f.prime}^${f.exp}`)).join(' · ');
}
