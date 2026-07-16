// 规范哈夫曼 · 实现
export interface ChHooks {
  onCode?: (sym: string, len: number, code: string) => void;
  onConclude?: (tableSize: number) => void;
}
export function canonicalHuffman(
  freq: ReadonlyArray<readonly [string, number]>,
  hooks: ChHooks = {},
): Map<string, { len: number; code: string }> {
  // 1. 求码长 (标准 Huffman)
  interface Node {
    s?: string;
    f: number;
    d: number;
    l?: Node;
    r?: Node;
  }
  const nodes: Node[] = freq.map(([s, f]) => ({ s, f, d: 0 }));
  if (nodes.length === 1) nodes[0]!.d = 1;
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f);
    const a = nodes.shift()!,
      b = nodes.shift()!;
    const inc = (n: Node) => {
      n.d++;
      if (n.l) inc(n.l);
      if (n.r) inc(n.r);
    };
    const par: Node = { f: a.f + b.f, d: 0, l: a, r: b };
    inc(par);
    nodes.push(par);
  }
  const lens = new Map<string, number>();
  const collect = (n?: Node) => {
    if (!n) return;
    if (n.s !== undefined) lens.set(n.s, n.d);
    collect(n.l);
    collect(n.r);
  };
  collect(nodes[0]);
  // 2. 规范编码: 按长度排序
  const sorted = [...lens.entries()].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
  const out = new Map<string, { len: number; code: string }>();
  let code = 0,
    prevLen = 0;
  for (const [s, len] of sorted) {
    if (prevLen !== 0) code = (code + 1) << (len - prevLen);
    out.set(s, { len, code: code.toString(2).padStart(len, '0') });
    hooks.onCode?.(s, len, out.get(s)!.code);
    prevLen = len;
  }
  hooks.onConclude?.(out.size);
  return out;
}
