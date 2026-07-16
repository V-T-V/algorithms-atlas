// =============================================================================
// 完全幂判定 · 纯算法实现
// =============================================================================

export interface PerfectPowerResult {
  isPerfectPower: boolean;
  base: number | null;
  exponent: number | null;
}

export interface PerfectPowerHooks {
  onTryExponent?: (b: number) => void;
  onResult?: (result: PerfectPowerResult) => void;
}

function ipow(a: number, b: number): number {
  let result = 1;
  let base = a;
  let e = b;
  while (e > 0) {
    if (e & 1) result *= base;
    base *= base;
    e >>>= 1;
  }
  return result;
}

export function isPerfectPower(n: number, hooks: PerfectPowerHooks = {}): PerfectPowerResult {
  if (n < 4) {
    const r: PerfectPowerResult = { isPerfectPower: false, base: null, exponent: null };
    hooks.onResult?.(r);
    return r;
  }
  const maxB = Math.floor(Math.log2(n));
  for (let b = maxB; b >= 2; b--) {
    hooks.onTryExponent?.(b);
    // 二分找底数 a 使 a^b = n
    let lo = 2;
    let hi = Math.floor(Math.pow(2, Math.ceil(Math.log2(n) / b))) + 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const val = ipow(mid, b);
      if (val === n) {
        const r: PerfectPowerResult = { isPerfectPower: true, base: mid, exponent: b };
        hooks.onResult?.(r);
        return r;
      }
      if (val < n) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  const r: PerfectPowerResult = { isPerfectPower: false, base: null, exponent: null };
  hooks.onResult?.(r);
  return r;
}
