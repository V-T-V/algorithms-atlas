// LZ 通用 v2 · 实现
export interface Lz2Token {
  distance: number;
  length: number;
}
export interface Lz2Hooks {
  onMatch?: (pos: number, dist: number, len: number) => void;
  onEmit?: (t: Lz2Token) => void;
}
export function lz2Encode(
  input: string,
  windowSize = 16,
  minMatch = 3,
  hooks: Lz2Hooks = {},
): Lz2Token[] {
  const out: Lz2Token[] = [];
  let pos = 0;
  while (pos < input.length) {
    let bestLen = 0;
    let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (
        pos + len < input.length &&
        input[pos - d + len] === input[pos + len] &&
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
      out.push({ distance: bestDist, length: bestLen });
      hooks.onEmit?.(out[out.length - 1]!);
      pos += bestLen;
    } else {
      // 单字符：distance=0, length=1（隐式）
      out.push({ distance: 0, length: 1 });
      hooks.onEmit?.(out[out.length - 1]!);
      pos++;
    }
  }
  return out;
}
export function lz2Decode(tokens: Lz2Token[]): string {
  let out = '';
  for (const t of tokens) {
    if (t.distance === 0)
      out += '?'; // 占位；实际需配合字符流
    else {
      const start = out.length - t.distance;
      for (let i = 0; i < t.length; i++) out += out[start + i]!;
    }
  }
  return out;
}
