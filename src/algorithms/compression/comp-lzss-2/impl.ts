// LZSS v2 · 实现
export interface LzssToken {
  flag: 0 | 1;
  literal?: number;
  distance?: number;
  length?: number;
}
export interface LzssHooks {
  onMatch?: (pos: number, d: number, l: number) => void;
  onEmit?: (t: LzssToken) => void;
}
export function lzssEncode(
  input: string,
  windowSize = 16,
  minMatch = 3,
  hooks: LzssHooks = {},
): LzssToken[] {
  const out: LzssToken[] = [];
  let pos = 0;
  const codes = input.split('').map((c) => c.charCodeAt(0));
  while (pos < codes.length) {
    let bestLen = 0;
    let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (
        pos + len < codes.length &&
        codes[pos - d + len] === codes[pos + len] &&
        len < windowSize
      )
        len++;
      if (len > bestLen) {
        bestLen = len;
        bestDist = d;
      }
    }
    if (bestLen >= minMatch) {
      hooks.onMatch?.(pos, bestDist, bestLen);
      const t: LzssToken = { flag: 1, distance: bestDist, length: bestLen };
      out.push(t);
      hooks.onEmit?.(t);
      pos += bestLen;
    } else {
      const t: LzssToken = { flag: 0, literal: codes[pos] };
      out.push(t);
      hooks.onEmit?.(t);
      pos++;
    }
  }
  return out;
}
