// =============================================================================
// Golomb-Rice 联合编码 · 纯算法实现
// =============================================================================

export interface GolombRiceHooks {
  onEncode?: (n: number, k: number, code: string) => void;
}

/** 单个非负整数的 Golomb-Rice 编码（参数 k，m=2^k）。 */
export function golombRiceEncode(n: number, k: number): string {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error(`n 必须 >= 0 的整数 / n must be a non-negative integer, got ${n}`);
  }
  if (k < 0 || !Number.isInteger(k)) {
    throw new Error(`k 必须 >= 0 的整数 / k must be a non-negative integer, got ${k}`);
  }
  const q = n >>> k;
  const r = n & ((1 << k) - 1);
  return '1'.repeat(q) + '0' + r.toString(2).padStart(k, '0');
}

/** 从比特串解析第一个 Golomb-Rice 编码。 */
export function golombRiceDecodeBitstream(
  bits: string,
  start: number,
  k: number,
): { value: number; length: number } {
  let i = start;
  let q = 0;
  while (i < bits.length && bits[i] === '1') {
    q++;
    i++;
  }
  if (i >= bits.length) throw new Error('比特流不完整');
  i++; // 跳过 '0'
  if (i + k > bits.length) throw new Error('比特流不完整');
  const r = parseInt(bits.slice(i, i + k), 2);
  i += k;
  return { value: (q << k) | r, length: i - start };
}

export function golombRiceEncodeAll(
  nums: readonly number[],
  k: number,
  hooks: GolombRiceHooks = {},
): string {
  let bits = '';
  for (const n of nums) {
    const code = golombRiceEncode(n, k);
    bits += code;
    hooks.onEncode?.(n, k, code);
  }
  return bits;
}

export function golombRiceDecodeAll(bits: string, k: number): number[] {
  const out: number[] = [];
  let pos = 0;
  while (pos < bits.length) {
    const { value, length } = golombRiceDecodeBitstream(bits, pos, k);
    out.push(value);
    pos += length;
  }
  return out;
}

/** 选择最优 k（对几何分布近似最优）。 */
export function optimalK(nums: readonly number[]): number {
  if (nums.length === 0) return 1;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  if (mean <= 0) return 0;
  const m = Math.max(1, Math.floor(0.69 * mean));
  return Math.max(0, Math.floor(Math.log2(m)));
}
