// =============================================================================
// Brotli 熵编码 (简化) · 纯算法实现
// 按频率构建 Huffman 码本，编码字面量序列。
// =============================================================================

interface HuffNode {
  sym: number;
  freq: number;
  l: HuffNode | null;
  r: HuffNode | null;
}

export interface BrotliEntropyHooks {
  onCode?: (sym: number, code: string) => void;
}

export function buildHuffman(freqs: Map<number, number>): Map<number, string> {
  if (freqs.size === 0) return new Map();
  if (freqs.size === 1) {
    const sym = freqs.keys().next()!.value as number;
    return new Map([[sym, '0']]);
  }
  const nodes: HuffNode[] = [];
  for (const [sym, freq] of freqs) {
    nodes.push({ sym, freq, l: null, r: null });
  }
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq || a.sym - b.sym);
    const a = nodes.shift()!;
    const b = nodes.shift()!;
    nodes.push({ sym: Math.min(a.sym, b.sym), freq: a.freq + b.freq, l: a, r: b });
  }
  const codes = new Map<number, string>();
  function walk(n: HuffNode, prefix: string): void {
    if (n.l === null && n.r === null) {
      codes.set(n.sym, prefix || '0');
      return;
    }
    if (n.l) walk(n.l, prefix + '0');
    if (n.r) walk(n.r, prefix + '1');
  }
  walk(nodes[0]!, '');
  return codes;
}

export function brotliEntropyEncode(
  data: readonly number[],
  hooks: BrotliEntropyHooks = {},
): { codes: Map<number, string>; bitstream: string } {
  const freqs = new Map<number, number>();
  for (const b of data) freqs.set(b, (freqs.get(b) ?? 0) + 1);
  const codes = buildHuffman(freqs);
  for (const [sym, code] of codes) hooks.onCode?.(sym, code);
  let bits = '';
  for (const b of data) bits += codes.get(b) ?? '';
  return { codes, bitstream: bits };
}

export function brotliEntropyDecode(codes: Map<number, string>, bitstream: string): number[] {
  const rev = new Map<string, number>();
  for (const [sym, code] of codes) rev.set(code, sym);
  const out: number[] = [];
  let cur = '';
  for (const bit of bitstream) {
    cur += bit;
    const sym = rev.get(cur);
    if (sym !== undefined) {
      out.push(sym);
      cur = '';
    }
  }
  return out;
}
