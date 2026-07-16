// =============================================================================
// 模快速幂
// =============================================================================

export interface ModPowHooks {
  onBit?: (i: number, bit: number, base: bigint, result: bigint) => void;
  onDone?: (value: bigint) => void;
}

export function modPow(base: bigint, exp: bigint, m: bigint, hooks: ModPowHooks = {}): bigint {
  if (m === 1n) {
    hooks.onDone?.(0n);
    return 0n;
  }
  let result = 1n;
  let b = base % m;
  if (b < 0n) b += m;
  let e = exp;
  let i = 0;
  while (e > 0n) {
    const bit = e & 1n;
    if (bit === 1n) {
      result = (result * b) % m;
    }
    hooks.onBit?.(i, Number(bit), b, result);
    b = (b * b) % m;
    e >>= 1n;
    i++;
  }
  hooks.onDone?.(result);
  return result;
}
