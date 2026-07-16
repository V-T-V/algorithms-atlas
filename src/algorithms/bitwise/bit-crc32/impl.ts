// =============================================================================
// CRC32 校验 · 纯算法实现
// =============================================================================

export interface Crc32Hooks {
  /** 每处理一个字节后调用（字节值、当前 crc）。 */
  onByte?: (byteValue: number, crc: number) => void;
}

const CRC_POLY = 0xedb88320; // 反转多项式

/** 256 项 CRC 表。 */
const CRC_TABLE: readonly number[] = (() => {
  const t = new Array<number>(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? (CRC_POLY ^ (c >>> 1)) >>> 0 : c >>> 1;
    }
    t[n] = c >>> 0;
  }
  return t;
})();

/**
 * CRC32：对字节数组计算 IEEE 802.3（zlib 变体）CRC32。
 * @param bytes 输入字节序列（每个 0..255）
 */
export function crc32(bytes: readonly number[], hooks: Crc32Hooks = {}): number {
  for (const b of bytes) {
    if (!Number.isInteger(b) || b < 0 || b > 0xff) {
      throw new RangeError(`crc32 字节要求 0..255，收到 ${b}`);
    }
  }
  let crc = 0xffffffff;
  for (const b of bytes) {
    crc = (CRC_TABLE[(crc ^ b) & 0xff]! ^ (crc >>> 8)) >>> 0;
    hooks.onByte?.(b, crc);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
