// =============================================================================
// 模逆元 Modular Inverse · 纯算法实现
// 求 a^(-1) mod m，即满足 a·x ≡ 1 (mod m) 的 x。两种方法：
//   1. 费马小定理：仅当 m 为素数，a^(-1) ≡ a^(m-2) (mod m)
//   2. 扩展欧几里得：对任意互素的 a, m 都适用
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 扩展欧几里得算法的步骤记录项。 */
export interface ExtGcdStep {
  /** 当前轮的被除数 */
  a: number;
  /** 当前轮的除数 */
  b: number;
  /** 商 a ÷ b */
  q: number;
  /** 余数 a mod b */
  r: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface InverseModHooks {
  /** 费马小定理路径：每做一次平方。 */
  onSquare?: (base: bigint) => void;
  /** 费马小定理路径：当前位为 1，把 base 乘入结果。 */
  onMultiply?: (result: bigint, base: bigint) => void;
  /** 观察指数的某一位。 */
  onBit?: (bit: 0 | 1, exp: bigint) => void;
  /** 扩展欧几里得路径：一轮 a ÷ b = q 余 r。 */
  onExtGcdStep?: (step: ExtGcdStep) => void;
  /** 扩展欧几里得完成，给出 Bézout 系数 (x, y) 与 gcd。 */
  onExtGcdDone?: (g: number, x: number, y: number) => void;
  /** 完成，给出最终逆元（已规范到 [0, m)）。 */
  onDone?: (inverse: bigint) => void;
}

/**
 * **费马小定理**求模逆元：`a^(-1) ≡ a^(m-2) (mod m)`。
 *
 * 要求 **m 为素数**且 `gcd(a, m) = 1`（即 a ≢ 0 mod m）。用 BigInt 做快速幂，
 * 中间值精确不溢出。
 *
 * 时间 `O(log m)`（快速幂的位数次乘法）。
 *
 * @param a 整数
 * @param m 素数模数（m ≥ 2）
 * @returns a^(-1) mod m，落在 [0, m)
 */
export function inverseModFermat(a: number, m: number, hooks: InverseModHooks = {}): bigint {
  if (m < 2) throw new RangeError('inverseModFermat: m must be ≥ 2');
  const M = BigInt(m);
  let base = ((BigInt(a) % M) + M) % M; // 规范到 [0, m)
  let result = 1n;
  let exp = BigInt(m - 2);
  while (exp > 0n) {
    const bit = (exp & 1n) === 1n ? 1 : 0;
    hooks.onBit?.(bit, exp);
    if (bit === 1) {
      result = (result * base) % M;
      hooks.onMultiply?.(result, base);
    }
    exp >>= 1n;
    if (exp > 0n) {
      base = (base * base) % M;
      hooks.onSquare?.(base);
    }
  }
  hooks.onDone?.(result);
  return result;
}

/**
 * **扩展欧几里得算法**：求 Bézout 系数 `(x, y)` 使 `a·x + m·y = gcd(a, m)`。
 *
 * 当 `gcd(a, m) = 1` 时，`x mod m` 即为 `a^(-1) mod m`。
 *
 * 用迭代版（扩展欧几里得表）：维护两行 (r, s, t)，每轮用商 q 推进，
 * 直至余数为 0；此时上一行的 r=gcd、s=x、t=y。
 *
 * 返回 `{ g, x, y }`，其中 `g = gcd(a, m)`（非负）。
 */
export function extGcd(
  a: number,
  m: number,
  hooks: InverseModHooks = {},
): { g: number; x: number; y: number } {
  let oldR = a;
  let r = m;
  let oldS = 1;
  let s = 0;
  let oldT = 0;
  let t = 1;
  while (r !== 0) {
    const q = Math.trunc(oldR / r);
    hooks.onExtGcdStep?.({ a: oldR, b: r, q, r: oldR - q * r });
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  hooks.onExtGcdDone?.(oldR, oldS, oldT);
  return { g: oldR, x: oldS, y: oldT };
}

/**
 * **扩展欧几里得**求模逆元：适用于任意互素的 `a, m`（m 不必是素数）。
 *
 * 当 `gcd(a, m) ≠ 1` 时抛错（不存在逆元）；否则返回 `a^(-1) mod m`，规范到 `[0, m)`。
 *
 * 时间 `O(log m)`。
 */
export function inverseModExtGcd(a: number, m: number, hooks: InverseModHooks = {}): bigint {
  if (m < 2) throw new RangeError('inverseModExtGcd: m must be ≥ 2');
  const { g, x } = extGcd(((a % m) + m) % m, m, hooks);
  if (g !== 1) throw new Error(`inverseModExtGcd: gcd(${a}, ${m}) = ${g} ≠ 1, no inverse`);
  // 把 x 规范到 [0, m)
  const M = BigInt(m);
  const inv = ((BigInt(x) % M) + M) % M;
  hooks.onDone?.(inv);
  return inv;
}

/**
 * 便捷入口：当 `m` 为素数时用费马小定理（默认），否则用扩展欧几里得。
 *
 * 也可直接指定 `method: 'fermat' | 'extgcd'`。
 */
export function inverseMod(
  a: number,
  m: number,
  hooks: InverseModHooks = {},
  method: 'fermat' | 'extgcd' = 'extgcd',
): bigint {
  return method === 'fermat' ? inverseModFermat(a, m, hooks) : inverseModExtGcd(a, m, hooks);
}
