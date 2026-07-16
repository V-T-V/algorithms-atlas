// 自适应哈夫曼 (简化权重累积) · 实现
export interface AhHooks {
  onSymbol?: (sym: string, freq: number, code: string) => void;
  onConclude?: (avgLen: number) => void;
}
export function adaptiveHuffman(stream: string, hooks: AhHooks = {}): Map<string, string> {
  const freq = new Map<string, number>();
  for (const ch of stream) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  // 每来一个符号重算 Huffman 编码 (简化)
  const codes = huffmanCode(freq);
  for (const [ch, f] of freq) hooks.onSymbol?.(ch, f, codes.get(ch) ?? '');
  let totalLen = 0,
    totalFreq = 0;
  for (const [ch, f] of freq) {
    totalLen += f * (codes.get(ch)?.length ?? 0);
    totalFreq += f;
  }
  hooks.onConclude?.(totalFreq > 0 ? totalLen / totalFreq : 0);
  return codes;
}
function huffmanCode(freq: Map<string, number>): Map<string, string> {
  interface Node {
    ch?: string;
    f: number;
    l?: Node;
    r?: Node;
  }
  const nodes: Node[] = [...freq.entries()].map(([ch, f]) => ({ ch, f }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f);
    const a = nodes.shift()!,
      b = nodes.shift()!;
    nodes.push({ f: a.f + b.f, l: a, r: b });
  }
  const codes = new Map<string, string>();
  const walk = (n: Node | undefined, code: string) => {
    if (!n) return;
    if (n.ch !== undefined) codes.set(n.ch, code || '0');
    walk(n.l, code + '0');
    walk(n.r, code + '1');
  };
  walk(nodes[0], '');
  return codes;
}
