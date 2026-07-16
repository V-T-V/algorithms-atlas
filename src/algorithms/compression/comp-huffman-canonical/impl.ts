// =============================================================================
// 规范 Huffman · 纯算法实现
// =============================================================================

interface HNode {
  sym: number;
  freq: number;
  len: number;
  l: HNode | null;
  r: HNode | null;
}

export interface CanonicalHuffmanHooks {
  onLength?: (sym: number, len: number) => void;
  onCode?: (sym: number, code: string) => void;
}

/** 标准求码长（用 Huffman 树）。 */
export function computeCodeLengths(freqs: Map<number, number>): Map<number, number> {
  if (freqs.size === 0) return new Map();
  if (freqs.size === 1) {
    const sym = freqs.keys().next()!.value as number;
    return new Map([[sym, 1]]);
  }
  const nodes: HNode[] = [];
  for (const [sym, freq] of freqs) {
    nodes.push({ sym, freq, len: 0, l: null, r: null });
  }
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq || a.sym - b.sym);
    const a = nodes.shift()!;
    const b = nodes.shift()!;
    nodes.push({ sym: Math.min(a.sym, b.sym), freq: a.freq + b.freq, len: 0, l: a, r: b });
  }
  const lens = new Map<number, number>();
  function walk(n: HNode, depth: number): void {
    if (n.l === null && n.r === null) {
      lens.set(n.sym, depth || 1);
      return;
    }
    if (n.l) walk(n.l, depth + 1);
    if (n.r) walk(n.r, depth + 1);
  }
  walk(nodes[0]!, 0);
  return lens;
}

/** 由码长按规范规则重建码本。返回 sym -> 二进制码字串。 */
export function buildCanonicalCodes(
  lengths: Map<number, number>,
  hooks: CanonicalHuffmanHooks = {},
): Map<number, string> {
  for (const [sym, len] of lengths) hooks.onLength?.(sym, len);
  const syms = [...lengths.keys()].sort((a, b) => a - b);
  // 按码长升序、符号升序分配
  const sorted = syms.sort((a, b) => {
    const la = lengths.get(a)!;
    const lb = lengths.get(b)!;
    if (la !== lb) return la - lb;
    return a - b;
  });
  const codes = new Map<number, string>();
  let code = 0;
  let prevLen = 0;
  for (const sym of sorted) {
    const len = lengths.get(sym)!;
    if (prevLen !== 0) code = (code + 1) << (len - prevLen);
    codes.set(sym, code.toString(2).padStart(len, '0'));
    prevLen = len;
    hooks.onCode?.(sym, codes.get(sym)!);
  }
  return codes;
}

/** 端到端：频率 → 规范 Huffman 码本。 */
export function canonicalHuffman(
  freqs: Map<number, number>,
  hooks: CanonicalHuffmanHooks = {},
): { lengths: Map<number, number>; codes: Map<number, string> } {
  const lengths = computeCodeLengths(freqs);
  const codes = buildCanonicalCodes(lengths, hooks);
  return { lengths, codes };
}

/** 用规范码本编码字面量序列。 */
export function encodeWith(codes: Map<number, string>, data: readonly number[]): string {
  let bits = '';
  for (const b of data) bits += codes.get(b) ?? '';
  return bits;
}

/** 用规范码本解码。 */
export function decodeWith(codes: Map<number, string>, bits: string): number[] {
  const rev = new Map<string, number>();
  for (const [sym, c] of codes) rev.set(c, sym);
  const out: number[] = [];
  let cur = '';
  for (const bit of bits) {
    cur += bit;
    const s = rev.get(cur);
    if (s !== undefined) {
      out.push(s);
      cur = '';
    }
  }
  return out;
}
