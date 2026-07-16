// =============================================================================
// 超级幂 · 纯算法实现
// =============================================================================

export interface SuperPowHooks {
  onDigit?: (digit: number, acc: number) => void;
}

const MOD = 1337;

function powMod(base: number, exp: number, mod: number): number {
  let result = 1;
  let b = base % mod;
  let e = exp;
  while (e > 0) {
    if (e & 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e >>>= 1;
  }
  return result;
}

export function superPow(a: number, b: readonly number[], hooks: SuperPowHooks = {}): number {
  if (b.length === 0) return 1 % MOD;
  let result = 1;
  for (const digit of b) {
    // result = (result^10 * a^digit) mod 1337
    result = (powMod(result, 10, MOD) * powMod(a, digit, MOD)) % MOD;
    hooks.onDigit?.(digit, result);
  }
  return result;
}
