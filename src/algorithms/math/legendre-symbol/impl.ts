// =============================================================================
// Legendre 符号 · 纯算法实现
// (a|p) = a^((p-1)/2) mod p，p 为奇素数。返回 -1/0/1。
// =============================================================================

/** 事件钩子。 */
export interface LegendreHooks {
  /** 计算出 a^((p-1)/2) mod p 的原始值（0..p-1）。 */
  onPow?: (raw: bigint) => void;
  /** 最终归一化结果 {-1,0,1}。 */
  onResult?: (value: number) => void;
}

function powMod(base: bigint, exp: bigint, m: bigint): bigint {
  let b = ((base % m) + m) % m;
  let e = exp;
  let r = 1n % m;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

/**
 * Legendre 符号 (a|p)，p 为奇素数。
 * @returns -1（非剩余）/ 0（p|a）/ 1（剩余）
 */
export function legendre(
  a: number | bigint,
  p: number | bigint,
  hooks: LegendreHooks = {},
): number {
  const aa = typeof a === 'number' ? BigInt(a) : a;
  const pp = typeof p === 'number' ? BigInt(p) : p;
  if (pp <= 2n) throw new RangeError('legendre: p must be an odd prime > 2');
  const raw = powMod(aa, (pp - 1n) / 2n, pp);
  hooks.onPow?.(raw);
  let value: number;
  if (raw === 0n) value = 0;
  else if (raw === 1n) value = 1;
  else value = -1; // raw === p - 1
  hooks.onResult?.(value);
  return value;
}
