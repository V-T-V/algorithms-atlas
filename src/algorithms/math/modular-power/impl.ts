// =============================================================================
// 模幂 Modular Power · 纯算法实现
// 计算 base^exp mod m，每步取模防溢出。使用 number 内部用 BigInt 保证精确。
// =============================================================================

/** 事件钩子（任一可选），供录制器使用。 */
export interface ModularPowerHooks {
  /** 观察指数当前最低位 bit（0/1），base 为当前平方累积值，exp 为剩余指数。 */
  onBit?: (bit: 0 | 1, base: number, exp: number) => void;
  /** base 自乘平方一次（结果已取模）。 */
  onSquare?: (base: number) => void;
  /** 当前位为 1，把 result 乘上 base（结果已取模）。 */
  onMultiply?: (result: number, base: number) => void;
}

/**
 * 模幂：计算 `base^exp mod m`。
 *
 * 把 exp 写成二进制，逐位扫描：
 *   - 每位都让 base 自乘（平方）一次
 *   - 当该位为 1 时把 base 乘入 result
 * 全程对 m 取模。内部用 BigInt 保证大数精确，对外返回 number。
 *
 * @param base 底数（任意整数，负数先规范化到 [0, m)）
 * @param exp 非负整数指数
 * @param m 模数（正整数）
 * @returns base^exp mod m，落在 [0, m)
 */
export function modularPower(
  base: number,
  exp: number,
  m: number,
  hooks: ModularPowerHooks = {},
): number {
  if (exp < 0) throw new RangeError('modularPower: exp must be non-negative');
  if (!Number.isInteger(m) || m <= 0)
    throw new RangeError('modularPower: m must be a positive integer');

  const mod = BigInt(m);
  let bb = ((BigInt(base) % mod) + mod) % mod;
  let rr = 1n % mod;
  let e = exp;

  while (e > 0) {
    const bit = (e & 1) as 0 | 1;
    const bbNum = Number(bb);
    hooks.onBit?.(bit, bbNum, e);
    if (bit === 1) {
      rr = (rr * bb) % mod;
      hooks.onMultiply?.(Number(rr), bbNum);
    }
    e = Math.floor(e / 2);
    if (e > 0) {
      bb = (bb * bb) % mod;
      hooks.onSquare?.(Number(bb));
    }
  }
  return Number(rr);
}
