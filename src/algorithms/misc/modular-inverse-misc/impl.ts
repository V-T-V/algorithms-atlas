// =============================================================================
// 模逆元 · 纯算法实现
// 用扩展欧几里得求 a^{-1} mod m（GCD(a,m)=1 时存在）。零 DOM 依赖，可独立单测。
// =============================================================================

/** 扩展欧几里得（内联）。 */
function extGcd(a: number, b: number): { gcd: number; x: number; y: number } {
  let oldR = a;
  let r = b;
  let oldS = 1;
  let s = 0;
  let oldT = 0;
  let t = 1;
  while (r !== 0) {
    const q = Math.trunc(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  return { gcd: oldR, x: oldS, y: oldT };
}

/** 事件钩子。 */
export interface ModInverseHooks {
  /** 扩展欧几里得求出 GCD 与系数后。 */
  onExtGcd?: (a: number, m: number, gcd: number, x: number) => void;
  /** 最终逆元（或 null 表示不存在）。 */
  onResult?: (inverse: number | null) => void;
}

/**
 * 求 a 在模 m 下的乘法逆元。
 * @returns 最小非负逆元；若 GCD(a,m)≠1 返回 null。
 */
export function modInverse(a: number, m: number, hooks: ModInverseHooks = {}): number | null {
  if (!Number.isInteger(a) || !Number.isInteger(m)) {
    throw new RangeError('a and m must be integers');
  }
  if (m <= 0) throw new RangeError('m must be positive');

  // 归一化 a 到 [0, m)
  const aNorm = ((a % m) + m) % m;
  if (aNorm === 0) {
    hooks.onResult?.(null);
    return null;
  }
  const { gcd, x } = extGcd(aNorm, m);
  hooks.onExtGcd?.(aNorm, m, gcd, x);
  if (gcd !== 1) {
    hooks.onResult?.(null);
    return null;
  }
  const inv = ((x % m) + m) % m;
  hooks.onResult?.(inv);
  return inv;
}

/**
 * 用费马小定理求逆（仅当 m 为素数）：a^{-1} ≡ a^{m-2} (mod m)。
 * 用快速幂 O(log m)。调用者需保证 m 为素数。
 */
export function modInverseFermat(a: number, m: number): number | null {
  if (!Number.isInteger(a) || !Number.isInteger(m)) {
    throw new RangeError('a and m must be integers');
  }
  if (m <= 0) throw new RangeError('m must be positive');
  const aNorm = ((a % m) + m) % m;
  if (aNorm === 0) return null;
  // 快速幂（BigInt 防 Number 溢出）
  function powMod(base: number, exp: number, mod: number): number {
    let result = 1n;
    let b = BigInt(base);
    const M = BigInt(mod);
    let e = exp;
    while (e > 0) {
      if (e & 1) result = (result * b) % M;
      b = (b * b) % M;
      e = Math.floor(e / 2);
    }
    return Number(result);
  }
  return powMod(aNorm, m - 2, m);
}

/** 验证 inv 是否为 a 的逆元（a·inv ≡ 1 mod m）。 */
export function isInverse(a: number, inv: number, m: number): boolean {
  return Number((((BigInt(a) * BigInt(inv)) % BigInt(m)) + BigInt(m)) % BigInt(m)) === 1 % m;
}
