// =============================================================================
// Brotli (简化) · 纯算法实现
// 静态字典匹配 + LZ77 窗口匹配。
// =============================================================================

export interface BrotliToken {
  isMatch: boolean;
  literal?: number;
  fromDict?: boolean;
  distance?: number;
  length?: number;
}

export interface BrotliHooks {
  onToken?: (pos: number, token: BrotliToken) => void;
}

export const STATIC_DICT = [
  104, 116, 116, 112, 58, 47, 47, 104, 116, 109, 108, 60, 47, 104, 116, 109, 108, 62,
];

export function brotliCompress(
  data: readonly number[],
  dict: readonly number[] = STATIC_DICT,
  hooks: BrotliHooks = {},
): BrotliToken[] {
  const tokens: BrotliToken[] = [];
  let pos = 0;
  const minMatch = 3;

  while (pos < data.length) {
    let bestLen = 0;
    let bestDist = 0;
    let fromDict = false;

    for (let d = 1; d <= dict.length; d++) {
      const ref = dict.length - d;
      let len = 0;
      while (
        len < 32 &&
        pos + len < data.length &&
        ref + len < dict.length &&
        dict[ref + len] === data[pos + len]
      ) {
        len++;
      }
      if (len > bestLen) {
        bestLen = len;
        bestDist = d;
        fromDict = true;
      }
    }
    for (let d = 1; d <= pos; d++) {
      const ref = pos - d;
      let len = 0;
      while (len < 32 && pos + len < data.length && data[ref + len] === data[pos + len]) {
        len++;
      }
      if (len > bestLen) {
        bestLen = len;
        bestDist = d;
        fromDict = false;
      }
    }

    if (bestLen >= minMatch) {
      const tok: BrotliToken = { isMatch: true, distance: bestDist, length: bestLen, fromDict };
      tokens.push(tok);
      hooks.onToken?.(pos, tok);
      pos += bestLen;
    } else {
      const tok: BrotliToken = { isMatch: false, literal: data[pos] };
      tokens.push(tok);
      hooks.onToken?.(pos, tok);
      pos++;
    }
  }
  return tokens;
}

export function brotliDecompress(
  tokens: readonly BrotliToken[],
  dict: readonly number[] = STATIC_DICT,
): number[] {
  const out: number[] = [];
  for (const t of tokens) {
    if (t.isMatch) {
      const len = t.length!;
      const d = t.distance!;
      if (t.fromDict) {
        const ref = dict.length - d;
        for (let i = 0; i < len; i++) out.push(dict[ref + i]!);
      } else {
        const ref = out.length - d;
        for (let i = 0; i < len; i++) out.push(out[ref + i]!);
      }
    } else {
      out.push(t.literal!);
    }
  }
  return out;
}
