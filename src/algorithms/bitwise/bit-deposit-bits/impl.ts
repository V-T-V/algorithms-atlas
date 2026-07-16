// =============================================================================
// 位放置（Bit Deposit / PDEP）· 纯算法实现
// =============================================================================

export interface DepositHooks {
  /** 每放置一个位后调用（源位位置 srcPos、目标位位置 dstPos、当前结果）。 */
  onBit?: (srcPos: number, dstPos: number, acc: number) => void;
}

/**
 * 位放置（PDEP）：把 x 的低位按顺序散布到 m 为 1 的位置。
 * @param x 源数据（32 位无符号，取其低位）
 * @param m 掩码（32 位无符号）
 */
export function depositBits(x: number, m: number, hooks: DepositHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`depositBits x 要求 32 位无符号整数，收到 ${x}`);
  }
  if (!Number.isInteger(m) || m < 0 || m > 0xffffffff) {
    throw new RangeError(`depositBits m 要求 32 位无符号整数，收到 ${m}`);
  }
  let res = 0;
  let src = 0;
  let mm = m >>> 0;
  let pos = 0;
  while (mm !== 0) {
    if (mm & 1) {
      const bit = (x >>> src) & 1;
      res = res | (bit << pos);
      hooks.onBit?.(src, pos, res >>> 0);
      src++;
    }
    pos++;
    mm = mm >>> 1;
  }
  return res >>> 0;
}
