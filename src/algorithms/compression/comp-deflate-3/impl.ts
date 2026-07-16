// DEFLATE v3 · 实现（简化：LZ77 + 频率表）
export interface DeflateToken {
  kind: 'lit' | 'match';
  len: number;
  distance?: number;
  literal?: number;
}
export interface DeflateHooks {
  onEmit?: (t: DeflateToken) => void;
  onHuffman?: (freq: Map<number, number>) => void;
}
export function deflateEncode(
  input: string,
  windowSize = 32,
  minMatch = 3,
  hooks: DeflateHooks = {},
): DeflateToken[] {
  const out: DeflateToken[] = [];
  const codes = input.split('').map((c) => c.charCodeAt(0));
  const freq = new Map<number, number>();
  let pos = 0;
  while (pos < codes.length) {
    let bestLen = 0;
    let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < codes.length && codes[pos - d + len] === codes[pos + len] && len < 258)
        len++;
      if (len > bestLen) {
        bestLen = len;
        bestDist = d;
      }
    }
    if (bestLen >= minMatch) {
      const t: DeflateToken = { kind: 'match', len: bestLen, distance: bestDist };
      out.push(t);
      hooks.onEmit?.(t);
      pos += bestLen;
      freq.set(256 + bestDist, (freq.get(256 + bestDist) ?? 0) + 1); // 距离符号占位
    } else {
      const c = codes[pos]!;
      freq.set(c, (freq.get(c) ?? 0) + 1);
      const t: DeflateToken = { kind: 'lit', len: 1, literal: c };
      out.push(t);
      hooks.onEmit?.(t);
      pos++;
    }
  }
  hooks.onHuffman?.(freq);
  return out;
}
