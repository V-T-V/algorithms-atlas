// =============================================================================
// 中国剩余定理扩展版 CRT Extension · 纯算法实现
// 合并 x ≡ r_i (mod m_i)，模数可非互素。无解返回 null。
// =============================================================================

export interface Crt2Result {
  value: bigint;
  modulus: bigint;
}

/** 事件钩子。 */
export interface Crt2Hooks {
  /** 开始合并一对 (r1,m1) 与 (r2,m2)。 */
  onMerge?: (r1: bigint, m1: bigint, r2: bigint, m2: bigint) => void;
  /** 求得 g = gcd(m1, m2)。 */
  onGcd?: (m1: bigint, m2: bigint, g: bigint) => void;
  /** 报告无解（差值不能被 g 整除）。 */
  onInfeasible?: (r1: bigint, r2: bigint, g: bigint) => void;
  /** 合并成功得到新 (r, m)。 */
  onMerged?: (r: bigint, m: bigint) => void;
  /** 全部完成。 */
  onDone?: (r: bigint, m: bigint) => void;
}

const abs = (n: bigint): bigint => (n < 0n ? -n : n);

function bigExtGcd(a: bigint, b: bigint): { g: bigint; x: bigint; y: bigint } {
  let oldR = a;
  let r = b;
  let oldS = 1n;
  let s = 0n;
  let oldT = 0n;
  let t = 1n;
  while (r !== 0n) {
    const q = oldR / r;
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  return { g: oldR, x: oldS, y: oldT };
}

/** 合并两个同余式 x ≡ r1 (mod m1), x ≡ r2 (mod m2)。无解返回 null。 */
export function mergeCongruence(
  r1: bigint,
  m1: bigint,
  r2: bigint,
  m2: bigint,
  hooks: Crt2Hooks = {},
): Crt2Result | null {
  hooks.onMerge?.(r1, m1, r2, m2);
  const gRaw = bigExtGcd(m1, m2).g;
  const g = abs(gRaw);
  hooks.onGcd?.(m1, m2, g);
  const diff = r2 - r1;
  if (diff % g !== 0n) {
    hooks.onInfeasible?.(r1, r2, g);
    return null;
  }
  const lcm = (m1 / g) * m2;
  // 求解 t ≡ ((r2-r1)/g) · inv(m1/g, m2/g) (mod m2/g)
  const { x: inv } = bigExtGcd(m1 / g, m2 / g);
  const mod = m2 / g;
  let t = (((diff / g) % mod) * ((inv % mod) + mod)) % mod;
  t = ((t % mod) + mod) % mod;
  let r = r1 + m1 * t;
  r = ((r % lcm) + lcm) % lcm;
  const result: Crt2Result = { value: r, modulus: abs(lcm) };
  hooks.onMerged?.(result.value, result.modulus);
  return result;
}

/**
 * 扩展 CRT：求解同余方程组 x ≡ remainders[i] (mod moduli[i])，模数可非互素。
 * @returns {value, modulus} 表示 x ≡ value (mod modulus)；无解返回 null。
 */
export function crtExtended(
  remainders: bigint[],
  moduli: bigint[],
  hooks: Crt2Hooks = {},
): Crt2Result | null {
  if (remainders.length !== moduli.length) {
    throw new TypeError('crtExtended: remainders and moduli length mismatch');
  }
  if (remainders.length === 0) return { value: 0n, modulus: 1n };

  let cur: Crt2Result = {
    value: ((remainders[0]! % moduli[0]!) + moduli[0]!) % moduli[0]!,
    modulus: abs(moduli[0]!),
  };
  for (let i = 1; i < remainders.length; i++) {
    const merged = mergeCongruence(cur.value, cur.modulus, remainders[i]!, moduli[i]!, hooks);
    if (merged === null) return null;
    cur = merged;
  }
  hooks.onDone?.(cur.value, cur.modulus);
  return cur;
}
