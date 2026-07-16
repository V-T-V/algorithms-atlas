// =============================================================================
// 前导零个数 (clz) · 纯算法实现
// 二分右移法（branchless）。
// =============================================================================

export interface ClzHooks {
  onStage?: (stage: number, mask: number, isZero: boolean, acc: number) => void;
}

/**
 * 32 位 clz（count leading zeros）：最高位 1 之前的零个数。
 * 0 的 clz 约定为 32。
 *   clz(1)         = 31
 *   clz(0x80000000)= 0
 *   clz(0x00010000)= 15
 *
 * 实现：若高 16 位为 0，则前导零至少 16，把低 16 位左移到高位继续二分；
 * 否则在高位范围内继续。每步累加相应计数。
 */
export function clz(n: number, hooks: ClzHooks = {}): number {
  if (!Number.isInteger(n) || n < 0 || n > 0xffffffff) {
    throw new RangeError(`clz 要求 32 位无符号整数，收到 ${n}`);
  }
  let x = n >>> 0;
  if (x === 0) return 32;
  let acc = 0;
  // 依次处理 16、8、4、2、1 位宽
  const stages = [16, 8, 4, 2, 1];
  let stageIdx = 0;
  for (const width of stages) {
    // 当前最高 width 位是否全 0
    const highBits = x >>> (32 - width);
    const isZero = highBits === 0;
    hooks.onStage?.(stageIdx, width, isZero, acc);
    if (isZero) {
      // 高 width 位全 0：累加 width，并把剩余位移到「当前字」的高位
      acc += width;
      x = (x << width) >>> 0;
    }
    stageIdx++;
  }
  return acc;
}

/** 把非负整数格式化为 32 位二进制字符串。 */
export function toBinary32(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0');
}
