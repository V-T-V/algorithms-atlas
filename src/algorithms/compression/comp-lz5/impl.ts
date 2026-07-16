// LZ5 · 实现
export interface Lz5Token {
  litLen: number;
  matchLen: number;
  distance: number;
}
export interface Lz5Hooks {
  onMatch?: (pos: number, dist: number, mlen: number) => void;
  onEmit?: (t: Lz5Token) => void;
}
export function lz5Encode(input: string, windowSize = 64, hooks: Lz5Hooks = {}): Lz5Token[] {
  const out: Lz5Token[] = [];
  let pos = 0;
  let litStart = 0;
  while (pos < input.length) {
    let bestLen = 0;
    let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < input.length && input[pos - d + len] === input[pos + len]) len++;
      if (len > bestLen) {
        bestLen = len;
        bestDist = d;
      }
    }
    if (bestLen >= 4) {
      hooks.onMatch?.(pos, bestDist, bestLen);
      out.push({ litLen: pos - litStart, matchLen: bestLen - 4, distance: bestDist });
      hooks.onEmit?.(out[out.length - 1]!);
      pos += bestLen;
      litStart = pos;
    } else pos++;
  }
  if (litStart < pos) out.push({ litLen: pos - litStart, matchLen: 0, distance: 0 });
  return out;
}
