// Zstd v2 · 实现（简化：LZ 匹配 + 频率统计）
export interface ZstdToken {
  kind: 'lit' | 'match';
  len: number;
  distance?: number;
  literal?: number;
}
export interface ZstdHooks {
  onEmit?: (t: ZstdToken) => void;
  onStats?: (freq: Map<number, number>) => void;
}
export function zstdEncode(
  input: string,
  windowSize = 32,
  minMatch = 3,
  hooks: ZstdHooks = {},
): ZstdToken[] {
  const out: ZstdToken[] = [];
  const codes = input.split('').map((c) => c.charCodeAt(0));
  const freq = new Map<number, number>();
  let pos = 0;
  while (pos < codes.length) {
    let bestLen = 0;
    let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < codes.length && codes[pos - d + len] === codes[pos + len] && len < 64)
        len++;
      if (len > bestLen) {
        bestLen = len;
        bestDist = d;
      }
    }
    if (bestLen >= minMatch) {
      const t: ZstdToken = { kind: 'match', len: bestLen, distance: bestDist };
      out.push(t);
      hooks.onEmit?.(t);
      pos += bestLen;
    } else {
      const c = codes[pos]!;
      freq.set(c, (freq.get(c) ?? 0) + 1);
      const t: ZstdToken = { kind: 'lit', len: 1, literal: c };
      out.push(t);
      hooks.onEmit?.(t);
      pos++;
    }
  }
  hooks.onStats?.(freq);
  return out;
}
