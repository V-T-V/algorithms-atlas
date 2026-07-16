// =============================================================================
// Elias Delta 编码 · 纯算法实现
// =============================================================================

export interface EliasDeltaHooks {
  onEncode?: (n: number, bits: string) => void;
  onDecode?: (n: number, consumed: number) => void;
}

/** 单个正整数的 Elias delta 编码（返回比特串）。 */
export function eliasDeltaEncode(n: number): string {
  if (n < 1 || !Number.isInteger(n)) {
    throw new Error(`n 必须 >= 1 的整数 / n must be a positive integer, got ${n}`);
  }
  if (n === 1) return '1';
  const bin = n.toString(2); // 含最高位 1
  const L = bin.length - 1; // 低位长度
  const lower = bin.slice(1); // 去掉最高位
  // 写 (L+1) 的 Elias gamma，再写 L 位低位
  const M = L + 1;
  const Mbin = M.toString(2);
  const gamma = '0'.repeat(Mbin.length - 1) + Mbin;
  return gamma + lower;
}

/** 从比特串解析第一个 Elias delta 编码，返回 { value, length }。 */
export function eliasDeltaDecodeBitstream(
  bits: string,
  start: number = 0,
): { value: number; length: number } {
  let i = start;
  let zeros = 0;
  while (i < bits.length && bits[i] === '0') {
    zeros++;
    i++;
  }
  if (i >= bits.length) throw new Error('比特流不完整 / incomplete bitstream');
  // 读 zeros+1 位得 M=L+1 的二进制
  const Mlen = zeros + 1;
  if (i + Mlen > bits.length) throw new Error('比特流不完整');
  const Mbin = bits.slice(i, i + Mlen);
  const M = parseInt(Mbin, 2);
  i += Mlen;
  const L = M - 1; // 低位长度
  // 读 L 位低位
  if (i + L > bits.length) throw new Error('比特流不完整');
  const lower = bits.slice(i, i + L);
  i += L;
  const value = parseInt('1' + lower, 2);
  return { value, length: i - start };
}

/** 批量编码。 */
export function eliasDeltaEncodeAll(nums: readonly number[], hooks: EliasDeltaHooks = {}): string {
  let bits = '';
  for (const n of nums) {
    const code = eliasDeltaEncode(n);
    bits += code;
    hooks.onEncode?.(n, code);
  }
  return bits;
}

/** 批量解码。 */
export function eliasDeltaDecodeAll(bits: string, hooks: EliasDeltaHooks = {}): number[] {
  const out: number[] = [];
  let pos = 0;
  while (pos < bits.length) {
    const { value, length } = eliasDeltaDecodeBitstream(bits, pos);
    out.push(value);
    hooks.onDecode?.(value, length);
    pos += length;
  }
  return out;
}
