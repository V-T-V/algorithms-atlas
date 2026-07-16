// =============================================================================
// Elias Omega 编码 · 纯算法实现
// =============================================================================

export interface EliasOmegaHooks {
  onEncode?: (n: number, bits: string) => void;
  onDecode?: (n: number) => void;
}

/** 单个正整数的 Elias omega 编码。 */
export function eliasOmegaEncode(n: number): string {
  if (n < 1 || !Number.isInteger(n)) {
    throw new Error(`n 必须 >= 1 的整数 / n must be a positive integer, got ${n}`);
  }
  if (n === 1) return '0';
  // 从最末组（= bin(n)）向外构造：每个前置组 = bin(当前组长度 - 1)，直到长度为 2
  const groups: string[] = [];
  let cur = n.toString(2);
  groups.unshift(cur);
  while (cur.length > 2) {
    cur = (cur.length - 1).toString(2);
    groups.unshift(cur);
  }
  return groups.join('') + '0';
}

/** 从比特流解析第一个 Elias omega 编码，返回 { value, length }。 */
export function eliasOmegaDecodeBitstream(
  bits: string,
  start: number = 0,
): { value: number; length: number } {
  let i = start;
  if (bits[i] === '0') return { value: 1, length: 1 };
  let n = 1;
  while (i < bits.length && bits[i] === '1') {
    // 当前组共 n+1 位：首位的 1 + n 个后续位
    const group = bits.slice(i, i + n + 1);
    if (group.length < n + 1) throw new Error('比特流不完整 / incomplete bitstream');
    i += n + 1; // 消费 n+1 位
    n = parseInt(group, 2);
  }
  // 跳过终止的 0
  i += 1;
  return { value: n, length: i - start };
}

export function eliasOmegaEncodeAll(nums: readonly number[], hooks: EliasOmegaHooks = {}): string {
  let bits = '';
  for (const n of nums) {
    const code = eliasOmegaEncode(n);
    bits += code;
    hooks.onEncode?.(n, code);
  }
  return bits;
}

export function eliasOmegaDecodeAll(bits: string, hooks: EliasOmegaHooks = {}): number[] {
  const out: number[] = [];
  let pos = 0;
  while (pos < bits.length) {
    const { value, length } = eliasOmegaDecodeBitstream(bits, pos);
    out.push(value);
    hooks.onDecode?.(value);
    pos += length;
  }
  return out;
}
