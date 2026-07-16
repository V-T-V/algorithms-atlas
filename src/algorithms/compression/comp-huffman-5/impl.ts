// 自适应 Huffman v5 · 实现（简化：每次重建）
export interface AhHooks {
  onEncode?: (sym: number, code: string) => void;
  onUpdate?: (freq: Map<number, number>) => void;
}
export function adaptiveHuffman(data: number[], hooks: AhHooks = {}): string {
  const freq = new Map<number, number>();
  let out = '';
  for (const sym of data) {
    if (freq.size === 0 || !freq.has(sym)) {
      // 新符号：先输出 8 位原始码（简化）
      const raw = sym.toString(2).padStart(8, '0');
      out += raw;
      hooks.onEncode?.(sym, raw);
    } else {
      // 用当前频率表生成 Huffman 并取该符号的码字（简化版每次重建）
      const codes = buildCodes(freq);
      const c = codes.get(sym) ?? '';
      out += c;
      hooks.onEncode?.(sym, c);
    }
    freq.set(sym, (freq.get(sym) ?? 0) + 1);
    hooks.onUpdate?.(freq);
  }
  return out;
}
function buildCodes(freq: Map<number, number>): Map<number, string> {
  interface N {
    sym?: number;
    f: number;
    l?: N;
    r?: N;
  }
  if (freq.size === 1) {
    const k = freq.keys().next().value as number;
    return new Map([[k, '0']]);
  }
  const nodes: N[] = [...freq.entries()].map(([sym, f]) => ({ sym, f }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f);
    const a = nodes.shift()!;
    const b = nodes.shift()!;
    nodes.push({ f: a.f + b.f, l: a, r: b });
  }
  const codes = new Map<number, string>();
  function walk(n: N, s: string) {
    if (n.sym !== undefined) codes.set(n.sym, s || '0');
    else {
      if (n.l) walk(n.l, s + '0');
      if (n.r) walk(n.r, s + '1');
    }
  }
  walk(nodes[0]!, '');
  return codes;
}
