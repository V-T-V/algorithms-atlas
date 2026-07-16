// =============================================================================
// 前导零计数（clz）二分变种 · 纯算法实现
// =============================================================================

export interface ClzHooks {
  /** 每一步二分后调用（当前 n、本步宽度、累加的 clz）。 */
  onStep?: (n: number, width: number, acc: number) => void;
}

/**
 * 前导零计数（二分变种）：返回 32 位无符号整数最高位 1 之前的 0 的个数。
 * 若 x == 0 返回 32。逐次按 16/8/4/2/1 位二分。
 * @param x 32 位无符号整数
 */
export function clz2(x: number, hooks: ClzHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`clz2 要求 32 位无符号整数，收到 ${x}`);
  }
  let n = x >>> 0;
  if (n === 0) return 32;
  let count = 0;
  let width = 16;
  while (width > 0) {
    const hi = n >>> width;
    hooks.onStep?.(n, width, count);
    if (hi === 0) {
      count += width;
    } else {
      n = hi;
    }
    width >>>= 1;
  }
  // 此时 n 只剩最高 1 位（若原本最高位就在最低位则 n=1）；需补上最后一次判断
  hooks.onStep?.(n, 0, count);
  // 上面循环结束时 width=0；若 n 的最高位（现已是第 0 位）为 0 则 +1
  if ((n & 1) === 0) count += 1;
  return count;
}
