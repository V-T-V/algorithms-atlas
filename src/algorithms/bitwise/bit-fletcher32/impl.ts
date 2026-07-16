// =============================================================================
// Fletcher-32 校验 · 纯算法实现
// =============================================================================

export interface Fletcher32Hooks {
  /** 每处理一个 16 位字后调用（字值、当前 s1、s2）。 */
  onWord?: (word: number, s1: number, s2: number) => void;
}

/**
 * Fletcher-32：对字节数组按 16 位小端字计算校验和。
 * 初始 s1 = s2 = 0xFFFF；每字 s1=(s1+word)%65535，s2=(s2+s1)%65535。
 * 奇数字节时高位补 0。结果 = (s2<<16)|s1。
 * @param bytes 输入字节序列（每个 0..255）
 */
export function fletcher32(bytes: readonly number[], hooks: Fletcher32Hooks = {}): number {
  for (const b of bytes) {
    if (!Number.isInteger(b) || b < 0 || b > 0xff) {
      throw new RangeError(`fletcher32 字节要求 0..255，收到 ${b}`);
    }
  }
  let s1 = 0xffff;
  let s2 = 0xffff;
  for (let i = 0; i < bytes.length; i += 2) {
    const lo = bytes[i]!;
    const hi = i + 1 < bytes.length ? bytes[i + 1]! : 0;
    const word = (hi << 8) | lo;
    s1 = (s1 + word) % 65535;
    s2 = (s2 + s1) % 65535;
    hooks.onWord?.(word, s1, s2);
  }
  return ((s2 << 16) | s1) >>> 0;
}
