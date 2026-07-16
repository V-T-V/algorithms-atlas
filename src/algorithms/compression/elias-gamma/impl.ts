// =============================================================================
// Elias Gamma 编码 · 纯算法实现
// 输出位串字符串（'0'/'1'），便于演示与单测。
// =============================================================================

export interface EliasGammaHooks {
  onEncode?: (n: number, bits: string) => void;
  onDecode?: (bits: string, value: number) => void;
}

/** 把正整数 n 编码为 Elias gamma 位串。 */
export function eliasGammaEncode(n: number, hooks: EliasGammaHooks = {}): string {
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError(`Elias gamma 要求正整数，收到 ${n}`);
  }
  const bin = n.toString(2); // 形如 '1...', 长度 = k+1
  const k = bin.length - 1;
  const bits = '0'.repeat(k) + bin;
  hooks.onEncode?.(n, bits);
  return bits;
}

/** 从位串（偏移 offset 起）解码一个 Elias gamma 整数。返回 { value, bitsRead }。 */
export function eliasGammaDecode(
  bits: string,
  offset = 0,
  hooks: EliasGammaHooks = {},
): { value: number; bitsRead: number } {
  let k = 0;
  let i = offset;
  while (i < bits.length && bits[i] === '0') {
    k++;
    i++;
  }
  if (i >= bits.length) {
    throw new Error('Elias gamma 解码：位串不完整（缺少数据位）');
  }
  // 读 k+1 位（含最高位的 1）
  const dataStart = i; // bits[i] === '1'
  const dataLen = k + 1;
  if (dataStart + dataLen > bits.length) {
    throw new Error('Elias gamma 解码：位串不完整');
  }
  const dataBits = bits.slice(dataStart, dataStart + dataLen);
  const value = parseInt(dataBits, 2);
  hooks.onDecode?.(dataBits, value);
  return { value, bitsRead: k + dataLen }; // k 个前导零 + (k+1) 个数据位
}

/** 批量编码为单一拼接位串。 */
export function eliasGammaEncodeMany(values: number[], hooks: EliasGammaHooks = {}): string {
  return values.map((v) => eliasGammaEncode(v, hooks)).join('');
}

/** 从拼接位串连续解码出整数数组。 */
export function eliasGammaDecodeMany(bits: string, hooks: EliasGammaHooks = {}): number[] {
  const out: number[] = [];
  let offset = 0;
  while (offset < bits.length) {
    const { value, bitsRead } = eliasGammaDecode(bits, offset, hooks);
    out.push(value);
    offset += bitsRead;
  }
  return out;
}

/** 计算编码长度（位数）。 */
export function eliasGammaBitLength(n: number): number {
  if (n < 1) throw new RangeError(`要求正整数，收到 ${n}`);
  return 2 * Math.floor(Math.log2(n)) + 1;
}
