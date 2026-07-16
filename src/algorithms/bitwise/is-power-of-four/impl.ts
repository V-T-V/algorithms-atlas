// =============================================================================
// 判断 4 的幂 · 纯算法实现
// =============================================================================

const MASK_EVEN_BITS = 0x55555555; // 0101 0101 ...

export interface IsPowerOfFourHooks {
  onCheckPositive?: (n: number, isPositive: boolean) => void;
  onCheckSingleBit?: (n: number, isSingleBit: boolean) => void;
  onCheckEvenPosition?: (n: number, isEven: boolean) => void;
  onResult?: (result: boolean) => void;
}

/**
 * 判断 n 是否 4 的幂：
 *  1) n > 0
 *  2) n 是 2 的幂：n & (n-1) == 0
 *  3) 唯一 1 位落在偶数位：n & 0x55555555 != 0
 */
export function isPowerOfFour(n: number, hooks: IsPowerOfFourHooks = {}): boolean {
  const isPositive = n > 0;
  hooks.onCheckPositive?.(n, isPositive);
  if (!isPositive) {
    hooks.onResult?.(false);
    return false;
  }
  const isSingleBit = (n & (n - 1)) === 0;
  hooks.onCheckSingleBit?.(n, isSingleBit);
  if (!isSingleBit) {
    hooks.onResult?.(false);
    return false;
  }
  const isEven = (n & MASK_EVEN_BITS) !== 0;
  hooks.onCheckEvenPosition?.(n, isEven);
  hooks.onResult?.(isEven);
  return isEven;
}

export function toBinary32(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0');
}
