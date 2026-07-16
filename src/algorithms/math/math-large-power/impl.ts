// =============================================================================
// 大数快速幂 · BigInt
// =============================================================================

export interface LargePowerHooks {
  onBit?: (bitPos: number, bit: 0 | 1, base: bigint, result: bigint) => void;
}

export function largePower(
  base: number | bigint,
  exp: number,
  hooks: LargePowerHooks = {},
): bigint {
  if (exp < 0) throw new Error('exp must be non-negative');
  let b = typeof base === 'bigint' ? base : BigInt(base);
  let e = Math.floor(exp);
  let result = 1n;
  let bitPos = 0;
  while (e > 0) {
    if (e & 1) {
      result *= b;
      hooks.onBit?.(bitPos, 1, b, result);
    } else {
      hooks.onBit?.(bitPos, 0, b, result);
    }
    b *= b;
    e = Math.floor(e / 2);
    bitPos++;
  }
  return result;
}
