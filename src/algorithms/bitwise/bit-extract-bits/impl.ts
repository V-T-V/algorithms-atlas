// =============================================================================
// 位提取（Bit Extract / PEXT）· 纯算法实现
// =============================================================================

export interface ExtractHooks {
  /** 每收集到一个位后调用（源位位置 srcPos、目标位位置 dstPos、当前结果）。 */
  onBit?: (srcPos: number, dstPos: number, acc: number) => void;
}

/**
 * 位提取（PEXT）：把 x 在掩码 m 为 1 的位置上的位，按顺序压缩到结果低位。
 * @param x 源数据（32 位无符号）
 * @param m 掩码（32 位无符号）
 */
export function extractBits(x: number, m: number, hooks: ExtractHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`extractBits x 要求 32 位无符号整数，收到 ${x}`);
  }
  if (!Number.isInteger(m) || m < 0 || m > 0xffffffff) {
    throw new RangeError(`extractBits m 要求 32 位无符号整数，收到 ${m}`);
  }
  let res = 0;
  let dst = 0;
  let mm = m >>> 0;
  let pos = 0;
  while (mm !== 0) {
    if (mm & 1) {
      const bit = (x >>> pos) & 1;
      res = res | (bit << dst);
      hooks.onBit?.(pos, dst, res >>> 0);
      dst++;
    }
    pos++;
    mm = mm >>> 1;
  }
  return res >>> 0;
}
