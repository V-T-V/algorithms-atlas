// =============================================================================
// 中国剩余定理（Chinese Remainder Theorem）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// 大数运算全程用 BigInt，保证正确性。
// =============================================================================

/** CRT 求解结果：x ≡ value (mod modulus)，且 modulus = ∏ mᵢ。 */
export interface CrtResult {
  value: bigint;
  modulus: bigint;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CrtHooks {
  /** 开始合并：给出当前累积答案 r 与对应模数 m。 */
  onMerge?: (r1: bigint, m1: bigint, r2: bigint, m2: bigint) => void;
  /** 对一对 (m1, m2) 用扩展欧几里得求得它们的 gcd 与系数。 */
  onGcd?: (m1: bigint, m2: bigint, g: bigint) => void;
  /** 合并一对同余式后得到新的 (r, m)。 */
  onMerged?: (r: bigint, m: bigint) => void;
  /** 全部合并完成，给出最终答案 x (mod M)。 */
  onDone?: (value: bigint, modulus: bigint) => void;
}

/** BigInt 绝对值。 */
const abs = (n: bigint): bigint => (n < 0n ? -n : n);

/** BigInt 最大公约数。 */
function bigGcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}

/**
 * 扩展欧几里得（BigInt 版）：返回 {g, x, y} 使 a·x + b·y = g = gcd(a,b)。
 */
function bigExtGcd(a: bigint, b: bigint): { g: bigint; x: bigint; y: bigint } {
  let oldR = a;
  let r = b;
  let oldS = 1n;
  let s = 0n;
  let oldT = 0n;
  let t = 1n;
  while (r !== 0n) {
    const q = oldR / r; // BigInt 除法本身向零取整
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  return { g: oldR, x: oldS, y: oldT };
}

/** BigInt 模，结果落在 [0, m)。 */
function modPos(a: bigint, m: bigint): bigint {
  return ((a % m) + m) % m;
}

/**
 * 合并两个同余式：x ≡ r1 (mod m1) 且 x ≡ r2 (mod m2)。
 *
 * 设 g = gcd(m1, m2)。仅当 (r2 - r1) 能被 g 整除时有解，合并后
 *   x ≡ r1 + m1 · t (mod lcm)，其中 lcm = m1·m2 / g，t 为线性方程的解。
 * 无解时抛 RangeError。
 */
function mergeCongruence(r1: bigint, m1: bigint, r2: bigint, m2: bigint): { r: bigint; m: bigint } {
  const { g, x } = bigExtGcd(m1, m2);
  const diff = r2 - r1;
  if (diff % g !== 0n) {
    throw new RangeError(
      `crt: no solution — r2 - r1 = ${diff} not divisible by gcd(${m1}, ${m2}) = ${g}`,
    );
  }
  const lcm = (m1 / g) * m2;
  const t = (diff / g) * x;
  const r = modPos(r1 + m1 * t, lcm);
  return { r, m: lcm };
}

/**
 * 中国剩余定理：求解线性同余方程组 `x ≡ remainders[i] (mod moduli[i])`。
 *
 * 原理（迭代合并法，可处理模数不互素的情形）：
 *   - 把两个同余式合并为一个等价的同余式：`x ≡ r (mod lcm(m1, m2))`
 *   - 反复合并直到只剩一个：最终 `x ≡ value (mod M)`，M = ∏ mᵢ（互素时）
 *   - 合并利用扩展欧几里得求 gcd(m1,m2) 与 Bézout 系数
 *
 * @param remainders 余数数组 aᵢ（可与 moduli 等长）
 * @param moduli 模数数组 mᵢ（正整数）
 * @returns `{ value, modulus }`：value (mod modulus) 即唯一解（modulus 为 lcm）。
 *          空输入返回 `{0, 1}`。无解抛 RangeError。
 */
export function crt(
  remainders: ReadonlyArray<number | bigint>,
  moduli: ReadonlyArray<number | bigint>,
  hooks: CrtHooks = {},
): CrtResult {
  if (remainders.length !== moduli.length) {
    throw new RangeError('crt: remainders and moduli length mismatch');
  }
  if (remainders.length === 0) {
    hooks.onDone?.(0n, 1n);
    return { value: 0n, modulus: 1n };
  }

  let r = modPos(BigInt(remainders[0]!), BigInt(moduli[0]!));
  let m = BigInt(moduli[0]!);
  if (m <= 0n) throw new RangeError('crt: moduli must be positive');

  for (let i = 1; i < moduli.length; i++) {
    const mi = BigInt(moduli[i]!);
    if (mi <= 0n) throw new RangeError('crt: moduli must be positive');
    const ri = modPos(BigInt(remainders[i]!), mi);
    hooks.onMerge?.(r, m, ri, mi);
    const g = bigGcd(m, mi);
    hooks.onGcd?.(m, mi, g);
    const merged = mergeCongruence(r, m, ri, mi);
    r = merged.r;
    m = merged.m;
    hooks.onMerged?.(r, m);
  }

  hooks.onDone?.(r, m);
  return { value: r, modulus: m };
}
