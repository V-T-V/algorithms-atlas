// Snappy v2 · 实现（简化）
export interface SnappyTag {
  kind: 'literal' | 'copy';
  len: number;
  distance?: number;
}
export interface SnappyHooks {
  onEmit?: (t: SnappyTag) => void;
}
export function snappyEncode(input: string, hooks: SnappyHooks = {}): SnappyTag[] {
  const out: SnappyTag[] = [];
  const codes = input.split('').map((c) => c.charCodeAt(0));
  let pos = 0;
  let litStart = 0;
  while (pos < codes.length) {
    let bestLen = 0;
    let bestDist = 0;
    const start = Math.max(0, pos - 2048); // 11-bit distance for demo
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < codes.length && codes[pos - d + len] === codes[pos + len] && len < 64)
        len++;
      if (len > bestLen) {
        bestLen = len;
        bestDist = d;
      }
    }
    if (bestLen >= 4) {
      if (pos - litStart > 0) {
        const t: SnappyTag = { kind: 'literal', len: pos - litStart };
        out.push(t);
        hooks.onEmit?.(t);
      }
      const t: SnappyTag = { kind: 'copy', len: bestLen, distance: bestDist };
      out.push(t);
      hooks.onEmit?.(t);
      pos += bestLen;
      litStart = pos;
    } else pos++;
  }
  if (litStart < pos) {
    const t: SnappyTag = { kind: 'literal', len: pos - litStart };
    out.push(t);
    hooks.onEmit?.(t);
  }
  return out;
}
