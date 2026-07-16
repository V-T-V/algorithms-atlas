// =============================================================================
// Zstandard (简化, 仅 LZ77 阶段) · 纯算法实现
// =============================================================================

export interface ZstdToken {
  isMatch: boolean;
  literal?: number;
  distance?: number;
  length?: number;
}

export interface ZstdHooks {
  onToken?: (pos: number, token: ZstdToken) => void;
}

export interface ZstdOptions {
  windowSize?: number;
  minMatch?: number;
  maxMatch?: number;
}

export function zstdCompress(
  data: readonly number[],
  opts: ZstdOptions = {},
  hooks: ZstdHooks = {},
): ZstdToken[] {
  const windowSize = opts.windowSize ?? 16;
  const minMatch = opts.minMatch ?? 3;
  const maxMatch = opts.maxMatch ?? 32;
  const tokens: ZstdToken[] = [];
  let pos = 0;

  while (pos < data.length) {
    const winStart = Math.max(0, pos - windowSize);
    let bestLen = 0;
    let bestDist = 0;

    for (let d = 1; d <= pos - winStart; d++) {
      const ref = pos - d;
      let len = 0;
      while (len < maxMatch && pos + len < data.length && data[ref + len] === data[pos + len]) {
        len++;
      }
      if (len > bestLen) {
        bestLen = len;
        bestDist = d;
      }
    }

    if (bestLen >= minMatch) {
      const tok: ZstdToken = { isMatch: true, distance: bestDist, length: bestLen };
      tokens.push(tok);
      hooks.onToken?.(pos, tok);
      pos += bestLen;
    } else {
      const tok: ZstdToken = { isMatch: false, literal: data[pos] };
      tokens.push(tok);
      hooks.onToken?.(pos, tok);
      pos++;
    }
  }
  return tokens;
}

export function zstdDecompress(tokens: readonly ZstdToken[], minMatch: number = 3): number[] {
  const out: number[] = [];
  for (const t of tokens) {
    if (t.isMatch) {
      const start = out.length - (t.distance ?? 0);
      const len = t.length ?? 0;
      for (let i = 0; i < len; i++) out.push(out[start + i]!);
    } else {
      out.push(t.literal ?? 0);
    }
  }
  void minMatch;
  return out;
}
