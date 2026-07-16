// =============================================================================
// 汉明距离（Hamming Distance）· 纯算法实现
// =============================================================================

export interface HammingHooks {
  /** 每清除一个差异位后调用（剩余的 d 值、已计数）。 */
  onClear?: (d: number, count: number) => void;
}

/**
 * 汉明距离：两个 32 位无符号整数 x、y 中对应位不同的位数。
 * 实现：d = x XOR y，再用 Kernighan 法（d &= d-1）逐位清除统计。
 * @param x 32 位无符号整数
 * @param y 32 位无符号整数
 */
export function hammingDistance(x: number, y: number, hooks: HammingHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`hammingDistance x 要求 32 位无符号整数，收到 ${x}`);
  }
  if (!Number.isInteger(y) || y < 0 || y > 0xffffffff) {
    throw new RangeError(`hammingDistance y 要求 32 位无符号整数，收到 ${y}`);
  }
  let d = (x ^ y) >>> 0;
  let count = 0;
  while (d !== 0) {
    d = (d & (d - 1)) >>> 0; // 清除最低位的 1
    count++;
    hooks.onClear?.(d, count);
  }
  return count;
}
