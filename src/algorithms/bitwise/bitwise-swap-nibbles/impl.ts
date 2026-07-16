// =============================================================================
// 半字节交换（Swap Nibbles）· 纯算法实现
// 把一个字节的低 4 位与高 4 位互换。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SwapNibblesHooks {
  /** 取出低半字节。 */
  onLowNibble?: (low: number) => void;
  /** 取出高半字节。 */
  onHighNibble?: (high: number) => void;
  /** 完成。 */
  onDone?: (result: number) => void;
}

/**
 * 交换字节的高低半字节。
 *
 * @param byte 0..255 的字节值
 * @param hooks 可选的事件钩子
 * @returns 交换后的字节值（0..255）
 */
export function swapNibbles(byte: number, hooks: SwapNibblesHooks = {}): number {
  if (!Number.isInteger(byte)) throw new TypeError(`byte 须为整数，收到 ${byte}`);
  if (byte < 0 || byte > 255) throw new RangeError(`byte 须在 0..255，收到 ${byte}`);
  const low = byte & 0x0f;
  const high = (byte & 0xf0) >> 4;
  hooks.onLowNibble?.(low);
  hooks.onHighNibble?.(high);
  const result = (low << 4) | high;
  hooks.onDone?.(result);
  return result;
}

/** 把字节格式化为 8 位二进制字符串。 */
export function toByteBinary(byte: number): string {
  let s = '';
  let x = byte & 0xff;
  for (let i = 0; i < 8; i++) {
    s = (x & 1) + s;
    x = x >> 1;
  }
  return s;
}
