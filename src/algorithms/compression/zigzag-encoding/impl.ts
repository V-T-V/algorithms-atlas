// =============================================================================
// ZigZag 编码 · 纯算法实现
// 有符号 ↔ 无符号 的可逆映射，配合 varint 使用。
// =============================================================================

export interface ZigzagHooks {
  onEncode?: (signed: number, unsigned: number) => void;
  onDecode?: (unsigned: number, signed: number) => void;
}

/** 假定 32 位整数宽（演示），更高位也成立。 */
const SHIFT = 31;

/**
 * ZigZag 编码：把有符号 32 位整数 n 映射成无符号。
 *   zz = (n << 1) ^ (n >> 31)  （算术右移复制符号位）
 * 用 JS 时需用 >>>0 保证非负。
 */
export function zigzagEncode(n: number, hooks: ZigzagHooks = {}): number {
  if (!Number.isInteger(n) || n < -2147483648 || n > 2147483647) {
    throw new RangeError(`zigzag 要求 32 位整数，收到 ${n}`);
  }
  // 算术右移：负数填 1，用 >> 即可
  const shifted = (n << 1) ^ (n >> SHIFT);
  const unsigned = shifted >>> 0;
  hooks.onEncode?.(n, unsigned);
  return unsigned;
}

/** ZigZag 解码：n = (zz >>> 1) ^ -(zz & 1)。 */
export function zigzagDecode(zz: number, hooks: ZigzagHooks = {}): number {
  if (!Number.isInteger(zz) || zz < 0 || zz > 0xffffffff) {
    throw new RangeError(`zigzag decode 要求 32 位无符号，收到 ${zz}`);
  }
  const signed = (zz >>> 1) ^ -(zz & 1);
  hooks.onDecode?.(zz, signed);
  return signed;
}

/** 批量编码。 */
export function zigzagEncodeMany(values: number[], hooks: ZigzagHooks = {}): number[] {
  return values.map((v) => zigzagEncode(v, hooks));
}

/** 批量解码。 */
export function zigzagDecodeMany(values: number[], hooks: ZigzagHooks = {}): number[] {
  return values.map((v) => zigzagDecode(v, hooks));
}
