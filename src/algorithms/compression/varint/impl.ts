// =============================================================================
// 可变长度整数编码 (varint / LEB128) · 纯算法实现
// =============================================================================

export interface VarintHooks {
  onByte?: (value: number, byte: number, isLast: boolean) => void;
}

/** 把一个非负整数编码为 LEB128 字节数组。 */
export function varintEncode(n: number, hooks: VarintHooks = {}): number[] {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`varint 要求非负整数，收到 ${n}`);
  }
  const out: number[] = [];
  let x = n;
  do {
    let byte = x & 0x7f;
    x = Math.floor(x / 128);
    if (x > 0) byte |= 0x80; // 继续位
    out.push(byte);
    hooks.onByte?.(n, byte, x === 0);
  } while (x > 0);
  return out;
}

/** 从字节数组（偏移 offset 起）解码一个 LEB128 整数。返回 { value, bytesRead }。 */
export function varintDecode(bytes: number[], offset = 0): { value: number; bytesRead: number } {
  let result = 0;
  let shift = 0;
  let bytesRead = 0;
  for (let i = offset; i < bytes.length; i++) {
    const byte = bytes[i]!;
    const payload = byte & 0x7f;
    result += payload * Math.pow(2, shift);
    shift += 7;
    bytesRead++;
    if ((byte & 0x80) === 0) {
      return { value: result, bytesRead };
    }
  }
  throw new Error('varint 序列未结束（缺少终止字节）');
}

/** 把多个整数连续编码进同一字节数组。 */
export function varintEncodeMany(values: number[], hooks: VarintHooks = {}): number[] {
  const out: number[] = [];
  for (const v of values) out.push(...varintEncode(v, hooks));
  return out;
}

/** 从字节数组连续解码出多个整数，返回值数组。 */
export function varintDecodeMany(bytes: number[]): number[] {
  const out: number[] = [];
  let offset = 0;
  while (offset < bytes.length) {
    const { value, bytesRead } = varintDecode(bytes, offset);
    out.push(value);
    offset += bytesRead;
  }
  return out;
}

/** 计算编码所需字节数（不实际编码）。 */
export function varintByteLength(n: number): number {
  if (n === 0) return 1;
  let len = 0;
  let x = n;
  while (x > 0) {
    len++;
    x = Math.floor(x / 128);
  }
  return len;
}
