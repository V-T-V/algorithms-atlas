// =============================================================================
// 中国剩余定理 · 纯算法实现
// 迭代合并同余式：x ≡ r1 (mod m1), x ≡ r2 (mod m2) → x ≡ r' (mod m1*m2)。
// 依赖扩展欧几里得。零 DOM 依赖，可独立单测。
// =============================================================================

/** 同余式：x ≡ remainder (mod modulus)。 */
export interface Congruence {
  remainder: number;
  modulus: number;
}

/** 扩展欧几里得（内联，保持模块自包含）。 */
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

/** 模乘（防溢出，用 Number，因模数不大）。 */
function modMul(a: number, b: number, m: number): number {
  return Number((((BigInt(a) * BigInt(b)) % BigInt(m)) + BigInt(m)) % BigInt(m));
}

/** 事件钩子。 */
export interface CrtHooks {
  /** 合并两条同余式后（新的合并 remainder 与 modulus）。 */
  onMerge?: (step: number, c1: Congruence, c2: Congruence, merged: Congruence) => void;
  /** 最终结果。 */
  onResult?: (x: number, modulus: number) => void;
}

/**
 * 合并两条同余式 x ≡ r1 (mod m1) 与 x ≡ r2 (mod m2)。
 * 要求 GCD(m1, m2) | (r2 - r1)（否则无解，抛错）。
 * 返回合并后的 x ≡ r (mod lcm(m1,m2))。
 */
function mergeCongruences(c1: Congruence, c2: Congruence): Congruence {
  const { gcd: g, x } = extGcd(c1.modulus, c2.modulus);
  const diff = c2.remainder - c1.remainder;
  if (diff % g !== 0) {
    throw new Error(
      `无解：${c2.remainder} - ${c1.remainder} = ${diff} 不被 GCD(${c1.modulus},${c2.modulus})=${g} 整除`,
    );
  }
  const lcm = (c1.modulus / g) * c2.modulus;
  // x = r1 + m1 * ( (diff/g) * x mod (m2/g) )
  const m2OverG = c2.modulus / g;
  const factor = ((diff / g) * (x % m2OverG)) % m2OverG;
  const r = modMul(c1.modulus, factor, lcm) + c1.remainder;
  const rr = ((r % lcm) + lcm) % lcm;
  return { remainder: rr, modulus: lcm };
}

/**
 * 中国剩余定理：求解同余方程组。
 * @param congruences 同余式数组（模数两两互质时一定有解）
 * @param hooks 可选事件钩子
 * @returns 满足所有同余的最小非负 x 及总模数
 */
export function crt(
  congruences: readonly Congruence[],
  hooks: CrtHooks = {},
): { x: number; modulus: number } {
  if (congruences.length === 0) {
    throw new RangeError('congruences must be non-empty');
  }
  // 校验模数合法
  for (const c of congruences) {
    if (c.modulus <= 0) throw new RangeError('modulus must be positive');
  }

  let acc: Congruence = {
    remainder:
      ((congruences[0]!.remainder % congruences[0]!.modulus) + congruences[0]!.modulus) %
      congruences[0]!.modulus,
    modulus: congruences[0]!.modulus,
  };

  for (let i = 1; i < congruences.length; i++) {
    const next: Congruence = {
      remainder:
        ((congruences[i]!.remainder % congruences[i]!.modulus) + congruences[i]!.modulus) %
        congruences[i]!.modulus,
      modulus: congruences[i]!.modulus,
    };
    const merged = mergeCongruences(acc, next);
    hooks.onMerge?.(i, acc, next, merged);
    acc = merged;
  }

  hooks.onResult?.(acc.remainder, acc.modulus);
  return { x: acc.remainder, modulus: acc.modulus };
}

/** 经典物不知数：x ≡ a (mod 3), x ≡ b (mod 5), x ≡ c (mod 7)。 */
export function sunzi(a: number, b: number, c: number): number {
  return crt([
    { remainder: a, modulus: 3 },
    { remainder: b, modulus: 5 },
    { remainder: c, modulus: 7 },
  ]).x;
}
