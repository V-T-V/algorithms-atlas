// =============================================================================
// PDEP（并行位放置）· 纯算法实现
// 用 m & -m 快速定位掩码的每个 1 位，把 x 的低位依次放入。
// =============================================================================

export interface PdepHooks {
  onPlace?: (srcPos: number, dstPos: number, acc: number) => void;
}

/**
 * PDEP：把 x 的低位按顺序散布到 m 为 1 的位置。
 * 实现用 `m & -m` 取最低位的 1，逐步推进掩码；x 的源位按顺序递增。
 * @param x 源（32 位无符号，取其低位）
 * @param m 掩码（32 位无符号）
 */
export function pdep(x: number, m: number, hooks: PdepHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`pdep x 要求 32 位无符号整数，收到 ${x}`);
  }
  if (!Number.isInteger(m) || m < 0 || m > 0xffffffff) {
    throw new RangeError(`pdep m 要求 32 位无符号整数，收到 ${m}`);
  }
  let res = 0;
  let src = 0;
  let mm = m >>> 0;
  while (mm !== 0) {
    const low = (mm & -mm) >>> 0; // m 的最低位 1 的位值
    const dstPos = Math.log2(low); // 目标位位置
    const bit = (x >>> src) & 1;
    res = res | (bit << dstPos);
    hooks.onPlace?.(src, dstPos, res >>> 0);
    src++;
    mm = (mm & (mm - 1)) >>> 0; // 清掉最低位 1
  }
  return res >>> 0;
}
