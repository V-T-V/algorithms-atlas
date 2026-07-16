// Huffman 编码 · 实现
export interface HuffmanNode {
  char: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
}
export interface HuffmanHooks {
  onMerge?: (a: HuffmanNode, b: HuffmanNode, merged: HuffmanNode) => void;
  onConclude?: (codes: Record<string, string>, totalBits: number) => void;
}
export interface HuffmanResult {
  root: HuffmanNode | null;
  codes: Record<string, string>;
  totalBits: number;
}
export function greedyHuffman3(
  freqs: ReadonlyArray<{ char: string; freq: number }>,
  hooks: HuffmanHooks = {},
): HuffmanResult {
  const nodes: HuffmanNode[] = freqs.map((f) => ({ ...f }));
  while (nodes.length >= 2) {
    nodes.sort((a, b) => a.freq - b.freq);
    const a = nodes.shift()!;
    const b = nodes.shift()!;
    const merged: HuffmanNode = { char: '*', freq: a.freq + b.freq, left: a, right: b };
    hooks.onMerge?.(a, b, merged);
    nodes.push(merged);
  }
  const root = nodes[0] ?? null;
  const codes: Record<string, string> = {};
  const walk = (n: HuffmanNode | undefined, code: string) => {
    if (!n) return;
    if (!n.left && !n.right) {
      codes[n.char] = code || '0';
      return;
    }
    walk(n.left, code + '0');
    walk(n.right, code + '1');
  };
  walk(root ?? undefined, '');
  let totalBits = 0;
  for (const f of freqs) totalBits += f.freq * codes[f.char]!.length;
  hooks.onConclude?.(codes, totalBits);
  return { root, codes, totalBits };
}
