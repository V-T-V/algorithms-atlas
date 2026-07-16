// =============================================================================
// 字节序交换（Byte Swap / BSWAP）· 纯算法实现
// =============================================================================

export interface BswapHooks {
  /** 提取每个字节后调用（字节下标 0=最低字节、字节值）。 */
  onByte?: (byteIndex: number, byteValue: number) => void;
}

/**
 * 字节序交换：反转 32 位整数的 4 个字节顺序。
 * 等价于 `(x & 0xff)<<24 | (x & 0xff00)<<8 | (x>>>8 & 0xff00) | (x>>>24 & 0xff)`。
 * @param x 32 位无符号整数
 */
export function bswap(x: number, hooks: BswapHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`bswap 要求 32 位无符号整数，收到 ${x}`);
  }
  const b0 = x & 0xff;
  const b1 = (x >>> 8) & 0xff;
  const b2 = (x >>> 16) & 0xff;
  const b3 = (x >>> 24) & 0xff;
  hooks.onByte?.(0, b0);
  hooks.onByte?.(1, b1);
  hooks.onByte?.(2, b2);
  hooks.onByte?.(3, b3);
  return ((b0 << 24) | (b1 << 16) | (b2 << 8) | b3) >>> 0;
}
