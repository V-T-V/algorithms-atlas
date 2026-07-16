// =============================================================================
// 扩展 Elias Gamma · 纯算法实现
// =============================================================================

export interface ExtGammaHooks {
  onEncode?: (n: number, bits: string) => void;
}

/** 标准 Elias gamma（正整数）。 */
export function gammaEncode(n: number): string {
  if (n < 1) throw new Error(`gamma 需正整数 / gamma needs positive int, got ${n}`);
  const bin = n.toString(2);
  const L = bin.length - 1;
  return '0'.repeat(L) + bin;
}

export function gammaDecodeBitstream(
  bits: string,
  start: number,
): { value: number; length: number } {
  let i = start;
  let zeros = 0;
  while (i < bits.length && bits[i] === '0') {
    zeros++;
    i++;
  }
  if (i >= bits.length) throw new Error('不完整');
  const L = zeros + 1;
  if (i + L > bits.length) throw new Error('不完整');
  const bin = bits.slice(i, i + L);
  return { value: parseInt(bin, 2), length: i + L - start };
}

/** 扩展 gamma：支持 0 和负数。 */
export function extGammaEncode(n: number): string {
  if (n === 0) return '00';
  if (n > 0) return '01' + gammaEncode(n);
  return '10' + gammaEncode(-n);
}

export function extGammaDecodeBitstream(
  bits: string,
  start: number,
): { value: number; length: number } {
  if (start + 2 > bits.length) throw new Error('不完整');
  const flag = bits.slice(start, start + 2);
  if (flag === '00') return { value: 0, length: 2 };
  const g = gammaDecodeBitstream(bits, start + 2);
  const value = flag === '01' ? g.value : -g.value;
  return { value, length: 2 + g.length };
}

export function extGammaEncodeAll(nums: readonly number[], hooks: ExtGammaHooks = {}): string {
  let bits = '';
  for (const n of nums) {
    const code = extGammaEncode(n);
    bits += code;
    hooks.onEncode?.(n, code);
  }
  return bits;
}

export function extGammaDecodeAll(bits: string): number[] {
  const out: number[] = [];
  let pos = 0;
  while (pos < bits.length) {
    const { value, length } = extGammaDecodeBitstream(bits, pos);
    out.push(value);
    pos += length;
  }
  return out;
}
