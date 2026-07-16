// =============================================================================
// 大数组合数 · 纯算法实现
// 素因子分解 + Legendre 公式，精确 BigInt。
// =============================================================================

/** 事件钩子。 */
export interface NCrLargeHooks {
  /** 找到一个素因子 p 及其幂次 e。 */
  onFactor?: (p: number, e: number) => void;
  /** 累乘 p^e 进结果。 */
  onMultiply?: (p: number, e: number, partial: bigint) => void;
  /** 完成。 */
  onDone?: (value: bigint) => void;
}

/** 统计 p 在 n! 中的幂次：Σ⌊n/p^k⌋。 */
function legendre(n: number, p: number): number {
  let e = 0;
  let pk = p;
  while (pk <= n) {
    e += Math.floor(n / pk);
    if (pk > Math.floor(n / p)) break; // 防溢出
    pk *= p;
  }
  return e;
}

function pow(bigBase: bigint, exp: number): bigint {
  let b = bigBase;
  let e = exp;
  let r = 1n;
  while (e > 0) {
    if (e & 1) r *= b;
    b *= b;
    e >>= 1;
  }
  return r;
}

/**
 * 精确计算 C(n, r)，返回 BigInt。
 * @returns C(n, r)；r<0 或 r>n 返回 0n
 */
export function nCrLarge(n: number, r: number, hooks: NCrLargeHooks = {}): bigint {
  if (r < 0 || r > n) return 0n;
  if (r === 0 || r === n) return 1n;
  // 对称化简
  if (r > n - r) r = n - r;

  // 筛 [2, n] 的素数
  const isComp = new Array<boolean>(n + 1).fill(false);
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (!isComp[i]) {
      primes.push(i);
      for (let j = i * i; j <= n; j += i) isComp[j] = true;
    }
  }

  let result = 1n;
  for (const p of primes) {
    const e = legendre(n, p) - legendre(r, p) - legendre(n - r, p);
    if (e > 0) {
      hooks.onFactor?.(p, e);
      result *= pow(BigInt(p), e);
      hooks.onMultiply?.(p, e, result);
    }
  }
  hooks.onDone?.(result);
  return result;
}
