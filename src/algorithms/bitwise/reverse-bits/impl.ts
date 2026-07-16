// =============================================================================
// 反转位（Reverse Bits）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」暴露逐位交换过程，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ReverseBitsHooks {
  /** 从低位取第 i 位（0-based，自右向左）。给出 i 与位值 0/1。 */
  onReadBit?: (i: number, bit: number) => void;
  /** 把该位写到结果的高位（左移）。给出结果当前值。 */
  onAccumulate?: (result: number, bitIndex: number) => void;
  /** 完成。给出最终反转后的值。 */
  onResult?: (result: number) => void;
}

/** 把非负整数转成 width 位二进制数组（高位在前）。 */
export function toBinaryArray(n: number, width: number = 8): number[] {
  const bits: number[] = [];
  const u = n >>> 0;
  for (let i = width - 1; i >= 0; i--) {
    bits.push((u >>> i) & 1);
  }
  return bits;
}

/**
 * 反转一个非负整数的二进制位（按固定位数 width）。
 *
 * 逐位法：从 n 的最低位起，依次取出每一位，把它「左移」拼到 result 的末尾。
 * 例如 8 位下 0b00010110 (22) → 0b01101000 (108)。
 *
 * 时间复杂度 O(width)，空间 O(1)。
 *
 * @param n 输入非负整数
 * @param width 位宽（默认 8）
 * @param hooks 可选事件钩子
 * @returns 反转位后的整数（按 width 位）
 */
export function reverseBits(n: number, width: number = 8, hooks: ReverseBitsHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`reverseBits 要求非负整数，收到 ${n}`);
  }
  if (!Number.isInteger(width) || width <= 0 || width > 32) {
    throw new RangeError(`width 须为 1..32，收到 ${width}`);
  }
  let result = 0;
  for (let i = 0; i < width; i++) {
    // 取 n 的第 i 位（从低位起）
    const bit = (n >>> i) & 1;
    hooks.onReadBit?.(i, bit);
    // 把它放到 result 的高位侧：result 左移 1，腾出最低位放 bit
    result = (result << 1) | bit;
    hooks.onAccumulate?.(result, i);
  }
  // 仅保留低 width 位
  result = result & ((1 << width) - 1);
  hooks.onResult?.(result);
  return result;
}

/** 8 位查表：预计算 0..255 的位反转，加速。 */
const REVERSE_BYTE_TABLE: readonly number[] = (() => {
  const t = new Array<number>(256);
  for (let i = 0; i < 256; i++) t[i] = reverseBits(i, 8);
  return t;
})();

/**
 * 查表法反转 32 位整数：每字节查表后拼回。
 * 用于对比验证。
 */
export function reverseBits32(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`reverseBits32 要求非负整数，收到 ${n}`);
  }
  const u = n >>> 0;
  const b0 = REVERSE_BYTE_TABLE[u & 0xff]!;
  const b1 = REVERSE_BYTE_TABLE[(u >>> 8) & 0xff]!;
  const b2 = REVERSE_BYTE_TABLE[(u >>> 16) & 0xff]!;
  const b3 = REVERSE_BYTE_TABLE[(u >>> 24) & 0xff]!;
  // 字节序也反转：最低字节变最高字节
  return ((b0 << 24) | (b1 << 16) | (b2 << 8) | b3) >>> 0;
}
