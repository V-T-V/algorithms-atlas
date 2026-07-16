// =============================================================================
// PEXT（并行位提取）· 纯算法实现
// 用 m & -m 快速定位掩码的每个 1 位，把 x 的对应位依次压缩到低位。
// =============================================================================

export interface PextHooks {
  onPick?: (srcPos: number, dstPos: number, acc: number) => void;
}

/**
 * PEXT：把 x 在 m 为 1 的位置上的位，按顺序压缩到结果低位。
 * 实现用 `m & -m` 取最低位的 1，逐步推进掩码；结果位按顺序递增。
 * @param x 源（32 位无符号）
 * @param m 掩码（32 位无符号）
 */
export function pext(x: number, m: number, hooks: PextHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`pext x 要求 32 位无符号整数，收到 ${x}`);
  }
  if (!Number.isInteger(m) || m < 0 || m > 0xffffffff) {
    throw new RangeError(`pext m 要求 32 位无符号整数，收到 ${m}`);
  }
  let res = 0;
  let dst = 0;
  let mm = m >>> 0;
  while (mm !== 0) {
    const low = (mm & -mm) >>> 0; // m 的最低位 1 的位值
    const srcPos = Math.log2(low); // 该位的位置（0-based）
    const bit = (x >>> srcPos) & 1;
    res = res | (bit << dst);
    hooks.onPick?.(srcPos, dst, res >>> 0);
    dst++;
    mm = (mm & (mm - 1)) >>> 0; // 清掉最低位 1
  }
  return res >>> 0;
}
