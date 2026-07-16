// 规范 Huffman v4 · 实现
export interface HuffSym {
  sym: number;
  len: number;
  code: number;
}
export interface ChHooks {
  onLengths?: (lens: Map<number, number>) => void;
  onCodes?: (codes: HuffSym[]) => void;
}
interface HuffNode {
  sym?: number;
  freq: number;
  left?: HuffNode;
  right?: HuffNode;
}
export function buildCodeLengths(freq: Map<number, number>): Map<number, number> {
  if (freq.size === 0) return new Map();
  if (freq.size === 1) {
    const k = freq.keys().next().value as number;
    return new Map([[k, 1]]);
  }
  const nodes: HuffNode[] = [...freq.entries()].map(([sym, f]) => ({ sym, freq: f }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const a = nodes.shift()!;
    const b = nodes.shift()!;
    nodes.push({ freq: a.freq + b.freq, left: a, right: b });
  }
  const lens = new Map<number, number>();
  function walk(n: HuffNode, d: number) {
    if (n.sym !== undefined) lens.set(n.sym, d || 1);
    else {
      if (n.left) walk(n.left, d + 1);
      if (n.right) walk(n.right, d + 1);
    }
  }
  walk(nodes[0]!, 0);
  return lens;
}
export function canonicalHuffman(freq: Map<number, number>, hooks: ChHooks = {}): HuffSym[] {
  const lens = buildCodeLengths(freq);
  hooks.onLengths?.(lens);
  // 按码长升序、符号升序
  const sorted = [...lens.entries()].sort((a, b) => (a[1] === b[1] ? a[0] - b[0] : a[1] - b[1]));
  let code = 0;
  let prevLen = 0;
  const out: HuffSym[] = sorted.map(([sym, len]) => {
    code = prevLen === 0 ? 0 : (code + 1) << (len - prevLen);
    prevLen = len;
    return { sym, len, code };
  });
  hooks.onCodes?.(out);
  return out;
}
