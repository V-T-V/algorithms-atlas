// =============================================================================
// 位运算模 2^n · 纯算法实现
// =============================================================================

export interface ModPower2Hooks {
  onCheckPower?: (n: number, isPower2: boolean) => void;
  onMask?: (mask: number) => void;
  onResult?: (x: number, mask: number, result: number) => void;
}

/** 判断 n 是否 2 的幂（n>0 且只有一位 1）。 */
export function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

/**
 * x mod 2^n：要求 n 是 2 的幂。
 *   result = x & (n - 1)
 * 若 n 非 2 的幂，抛错。
 */
export function modPower2(x: number, n: number, hooks: ModPower2Hooks = {}): number {
  if (!Number.isInteger(x) || x < 0) {
    throw new RangeError(`x 要求非负整数，收到 ${x}`);
  }
  if (!Number.isInteger(n) || n <= 0) {
    throw new RangeError(`n 要求正整数，收到 ${n}`);
  }
  const isP2 = isPowerOfTwo(n);
  hooks.onCheckPower?.(n, isP2);
  if (!isP2) {
    throw new RangeError(`n 必须是 2 的幂，收到 ${n}`);
  }
  const mask = n - 1;
  hooks.onMask?.(mask);
  const result = x & mask;
  hooks.onResult?.(x, mask, result);
  return result;
}

export function toBinary32(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0');
}
