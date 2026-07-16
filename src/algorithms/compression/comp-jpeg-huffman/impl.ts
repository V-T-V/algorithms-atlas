// =============================================================================
// JPEG Huffman 表 · 纯算法实现
// 由 BITS / HUFFVAL 构建规范码本；并支持比特流解码。
// =============================================================================

export interface JpegHuffTable {
  bits: number[]; // 长度 16，bits[i-1] = 码长 i 的符号数
  huffval: number[]; // 所有符号
  /** sym -> 码字（二进制串）。 */
  codes: Map<number, string>;
}

export interface JpegHooks {
  onSymbol?: (sym: number, code: string) => void;
}

/** 由 BITS/HUFFVAL 生成 JPEG 规范 Huffman 码本。 */
export function buildJpegTable(
  bits: number[],
  huffval: number[],
  hooks: JpegHooks = {},
): JpegHuffTable {
  const codes = new Map<number, string>();
  let code = 0;
  let k = 0;
  for (let len = 1; len <= 16; len++) {
    const count = bits[len - 1] ?? 0;
    for (let j = 0; j < count; j++) {
      const sym = huffval[k]!;
      const codeword = code.toString(2).padStart(len, '0');
      codes.set(sym, codeword);
      hooks.onSymbol?.(sym, codeword);
      code++;
      k++;
    }
    code <<= 1;
  }
  return { bits, huffval, codes };
}

/** 用 JPEG 码本解码比特流（返回符号序列）。 */
export function jpegDecode(codes: Map<number, string>, bits: string): number[] {
  const rev = new Map<string, number>();
  for (const [sym, c] of codes) rev.set(c, sym);
  const out: number[] = [];
  let cur = '';
  for (const bit of bits) {
    cur += bit;
    const sym = rev.get(cur);
    if (sym !== undefined) {
      out.push(sym);
      cur = '';
    }
  }
  return out;
}

/** 用 JPEG 码本编码符号序列为比特流。 */
export function jpegEncode(codes: Map<number, string>, syms: readonly number[]): string {
  let bits = '';
  for (const s of syms) bits += codes.get(s) ?? '';
  return bits;
}

/** 反向：从频率表生成 JPEG BITS/HUFFVAL（用于编码端构建表）。 */
export function deriveBits(freqs: Map<number, number>): { bits: number[]; huffval: number[] } {
  // 求每个符号的码长（经典 Huffman）
  interface N {
    sym: number;
    f: number;
    l: N | null;
    r: N | null;
  }
  if (freqs.size === 0) return { bits: new Array(16).fill(0), huffval: [] };
  if (freqs.size === 1) {
    const sym = freqs.keys().next()!.value as number;
    const bits = new Array(16).fill(0);
    bits[0] = 1;
    return { bits, huffval: [sym] };
  }
  const nodes: N[] = [];
  for (const [sym, f] of freqs) nodes.push({ sym, f, l: null, r: null });
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f || a.sym - b.sym);
    const a = nodes.shift()!;
    const b = nodes.shift()!;
    nodes.push({ sym: Math.min(a.sym, b.sym), f: a.f + b.f, l: a, r: b });
  }
  const lens = new Map<number, number>();
  function walk(n: N, d: number): void {
    if (n.l === null && n.r === null) {
      lens.set(n.sym, Math.min(d, 16));
      return;
    }
    if (n.l) walk(n.l, d + 1);
    if (n.r) walk(n.r, d + 1);
  }
  walk(nodes[0]!, 0);
  const bits = new Array(16).fill(0);
  const byLen: Array<Array<number>> = Array.from({ length: 17 }, () => []);
  for (const [sym, len] of lens) byLen[len]!.push(sym);
  const huffval: number[] = [];
  for (let len = 1; len <= 16; len++) {
    byLen[len]!.sort((a, b) => a - b);
    bits[len - 1] = byLen[len]!.length;
    huffval.push(...byLen[len]!);
  }
  return { bits, huffval };
}
