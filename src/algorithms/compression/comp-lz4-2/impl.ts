// LZ4 v2 · 实现
export interface Lz4Token {
  litLen: number;
  matchLen: number;
  distance: number;
}
export interface Lz4Hooks {
  onMatch?: (pos: number, dist: number, mlen: number) => void;
  onEmit?: (t: Lz4Token) => void;
}
export function lz4Encode(input: string, windowSize = 32, hooks: Lz4Hooks = {}): Lz4Token[] {
  const out: Lz4Token[] = [];
  let pos = 0;
  let litStart = 0;
  while (pos < input.length) {
    let bestLen = 0;
    let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (
        pos + len < input.length &&
        input[pos - d + len] === input[pos + len] &&
        len < 255 + 15
      )
        len++;
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
  // 最后一段 literals
  if (litStart < pos) out.push({ litLen: pos - litStart, matchLen: 0, distance: 0 });
  return out;
}
