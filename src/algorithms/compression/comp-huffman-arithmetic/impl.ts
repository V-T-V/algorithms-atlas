// =============================================================================
// Huffman + 算术混合 · 纯算法实现
// =============================================================================

interface HNode {
  sym: number;
  freq: number;
  l: HNode | null;
  r: HNode | null;
}

export interface HybridHooks {
  onCode?: (sym: number, code: string, method: 'huffman' | 'arithmetic') => void;
}

function buildHuffman(freqs: Map<number, number>): Map<number, string> {
  if (freqs.size === 0) return new Map();
  if (freqs.size === 1) {
    const sym = freqs.keys().next()!.value as number;
    return new Map([[sym, '0']]);
  }
  const nodes: HNode[] = [];
  for (const [sym, freq] of freqs) nodes.push({ sym, freq, l: null, r: null });
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq || a.sym - b.sym);
    const a = nodes.shift()!;
    const b = nodes.shift()!;
    nodes.push({ sym: Math.min(a.sym, b.sym), freq: a.freq + b.freq, l: a, r: b });
  }
  const out = new Map<number, string>();
  function walk(n: HNode, prefix: string): void {
    if (n.l === null && n.r === null) {
      out.set(n.sym, prefix || '0');
      return;
    }
    if (n.l) walk(n.l, prefix + '0');
    if (n.r) walk(n.r, prefix + '1');
  }
  walk(nodes[0]!, '');
  return out;
}

/** 整数算术编码：把一串 0..base-1 的符号压缩成一个数值区间下界（用比例表示）。 */
export function arithmeticEncodeInt(
  syms: readonly number[],
  cumFreq: number[],
  total: number,
): number {
  let lo = 0;
  let range = total;
  for (const s of syms) {
    const step = range / total;
    lo = lo + step * cumFreq[s]!;
    range = step * (cumFreq[s + 1]! - cumFreq[s]!);
  }
  return lo; // 区间下界，作为编码值
}

export interface HybridResult {
  bitstream: string;
  huffmanSyms: Set<number>;
  codes: Map<number, string>;
}

/** K = 用 Huffman 的前 K 个高频符号。 */
export function hybridEncode(
  data: readonly number[],
  K: number = 3,
  hooks: HybridHooks = {},
): HybridResult {
  const freqs = new Map<number, number>();
  for (const b of data) freqs.set(b, (freqs.get(b) ?? 0) + 1);
  const sorted = [...freqs.entries()].sort((a, b) => b[1] - a[1]);
  const huffSyms = new Set(sorted.slice(0, K).map((e) => e[0]));
  const huffFreqs = new Map<number, number>();
  for (const [s, f] of freqs) if (huffSyms.has(s)) huffFreqs.set(s, f);
  const codes = buildHuffman(huffFreqs);

  // 算术编码兜底：为非高频符号构建累积频率
  const rareSyms = sorted.slice(K).map((e) => e[0]);
  let bits = '';
  for (const b of data) {
    if (huffSyms.has(b)) {
      bits += '1' + (codes.get(b) ?? '');
      hooks.onCode?.(b, codes.get(b) ?? '', 'huffman');
    } else {
      bits += '0' + b.toString(2).padStart(8, '0');
      hooks.onCode?.(b, b.toString(2).padStart(8, '0'), 'arithmetic');
    }
  }
  void rareSyms;
  return { bitstream: bits, huffmanSyms: huffSyms, codes };
}

export function hybridDecode(result: HybridResult, bitstream: string, count: number): number[] {
  const out: number[] = [];
  let i = 0;
  const rev = new Map<string, number>();
  for (const [sym, c] of result.codes) rev.set('1' + c, sym);
  while (out.length < count && i < bitstream.length) {
    // 尝试匹配 huffman 前缀
    let matched = false;
    for (const [prefix, sym] of rev) {
      if (bitstream.startsWith(prefix, i)) {
        out.push(sym);
        i += prefix.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // arithmetic: '0' + 8 位
      i += 1;
      if (i + 8 > bitstream.length) break;
      out.push(parseInt(bitstream.slice(i, i + 8), 2));
      i += 8;
    }
  }
  return out;
}
