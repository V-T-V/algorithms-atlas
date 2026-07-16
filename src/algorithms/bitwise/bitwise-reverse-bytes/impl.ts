// =============================================================================
// 按字节反转位序（Reverse Bits by Bytes）· 纯算法实现
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ReverseBytesHooks {
  /** 处理第 byteIndex 个字节（从低位起 0-based），给出反转结果。 */
  onByte?: (byteIndex: number, original: number, reversed: number) => void;
  /** 完成。 */
  onDone?: (result: number) => void;
}

/** 单字节位反转（朴素）。 */
function reverseByte(b: number): number {
  let r = 0;
  for (let i = 0; i < 8; i++) {
    r = (r << 1) | (b & 1);
    b = b >> 1;
  }
  return r & 0xff;
}

/** 256 项位反转表。 */
const REVERSE_TABLE: readonly number[] = (() => {
  const t = new Array<number>(256);
  for (let i = 0; i < 256; i++) t[i] = reverseByte(i);
  return t;
})();

/**
 * 按字节反转位序：把 value 的 numBytes 个字节位反转后顺序也反转。
 *
 * @param value 非负整数
 * @param numBytes 字节数（默认 4，对应 32 位）
 * @param hooks 可选的事件钩子
 */
export function reverseBitsByBytes(
  value: number,
  numBytes = 4,
  hooks: ReverseBytesHooks = {},
): number {
  if (value < 0) throw new RangeError(`value 须非负，收到 ${value}`);
  if (numBytes < 1) throw new RangeError(`numBytes 须 >= 1，收到 ${numBytes}`);
  let result = 0;
  for (let i = 0; i < numBytes; i++) {
    const byte = (value >> (8 * i)) & 0xff;
    const rev = REVERSE_TABLE[byte]!;
    hooks.onByte?.(i, byte, rev);
    // 反转后的字节放到「对面」位置：第 i 字节 → 第 (numBytes-1-i) 字节
    result |= rev << (8 * (numBytes - 1 - i));
  }
  // 用 >>>0 保证非负 32 位解释
  const final = numBytes <= 4 ? result >>> 0 : result;
  hooks.onDone?.(final);
  return final;
}

/** 把非负整数格式化为定宽二进制字符串。 */
export function toBinaryString(n: number, width: number): string {
  let s = '';
  let x = n;
  for (let i = 0; i < width; i++) {
    s = (x & 1) + s;
    x = Math.floor(x / 2);
  }
  return s;
}
