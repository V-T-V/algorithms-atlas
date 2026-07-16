// =============================================================================
// 位合并（Bit Merge / Blend）· 纯算法实现
// =============================================================================

export interface MergeHooks {
  /** 计算各部分后调用（x 部分、y 部分、最终结果）。 */
  onParts?: (xPart: number, yPart: number, result: number) => void;
}

/**
 * 位合并：按掩码 m 合并 x 与 y。
 * - m 的 1 位：取自 y
 * - m 的 0 位：取自 x
 * 即 result = (x & ~m) | (y & m)。
 * @param x 源 A（32 位无符号）
 * @param y 源 B（32 位无符号）
 * @param m 掩码（32 位无符号）
 */
export function mergeBits(x: number, y: number, m: number, hooks: MergeHooks = {}): number {
  if (![x, y, m].every((v) => Number.isInteger(v) && v >= 0 && v <= 0xffffffff)) {
    throw new RangeError('mergeBits 要求 32 位无符号整数');
  }
  const xu = x >>> 0;
  const yu = y >>> 0;
  const mu = m >>> 0;
  const xPart = xu & ~mu; // x 在 m=0 处的位
  const yPart = yu & mu; // y 在 m=1 处的位
  const result = (xPart | yPart) >>> 0;
  hooks.onParts?.(xPart >>> 0, yPart >>> 0, result);
  return result;
}
