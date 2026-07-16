// =============================================================================
// LZ4 (简化) · 纯算法实现
// =============================================================================

export interface Lz4Token {
  literals: number[];
  matchLength: number; // 实际匹配长度 - minMatch
  distance: number;
}

export interface Lz4Hooks {
  onToken?: (pos: number, token: Lz4Token) => void;
}

export interface Lz4Options {
  windowSize?: number;
  minMatch?: number;
  maxMatch?: number;
}

export function lz4Compress(
  data: readonly number[],
  opts: Lz4Options = {},
  hooks: Lz4Hooks = {},
): Lz4Token[] {
  const windowSize = opts.windowSize ?? 12;
  const minMatch = opts.minMatch ?? 3;
  const maxMatch = opts.maxMatch ?? 18 + 15; // 4 位 + 扩展
  const tokens: Lz4Token[] = [];
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
      const token: Lz4Token = {
        literals: data.slice(pos > 0 ? findLastLiteralEnd(tokens, data) : 0, pos),
        matchLength: bestLen - minMatch,
        distance: bestDist,
      };
      // 修正 literals：累计所有未匹配字面量
      tokens.push(refineToken(data, token, pos, bestLen, bestDist, minMatch));
      hooks.onToken?.(pos, token);
      pos += bestLen;
    } else {
      pos++;
    }
  }
  // 末尾剩余字面量
  const lastEnd = computeLastMatchEnd(data, tokens, minMatch);
  if (lastEnd < data.length) {
    tokens.push({
      literals: data.slice(lastEnd),
      matchLength: 0,
      distance: 0,
    });
  }
  return tokens;
}

function refineToken(
  _data: readonly number[],
  token: Lz4Token,
  _pos: number,
  bestLen: number,
  bestDist: number,
  minMatch: number,
): Lz4Token {
  return {
    literals: token.literals,
    matchLength: bestLen - minMatch,
    distance: bestDist,
  };
}

function findLastLiteralEnd(tokens: readonly Lz4Token[], _data: readonly number[]): number {
  let consumed = 0;
  for (const t of tokens) {
    consumed += t.literals.length;
    if (t.distance > 0) consumed += t.matchLength + 3; // minMatch=3
  }
  return consumed;
}

function computeLastMatchEnd(
  _data: readonly number[],
  tokens: readonly Lz4Token[],
  minMatch: number,
): number {
  let consumed = 0;
  for (const t of tokens) {
    consumed += t.literals.length;
    if (t.distance > 0) consumed += t.matchLength + minMatch;
  }
  return consumed;
}

export function lz4Decompress(tokens: readonly Lz4Token[], minMatch: number = 3): number[] {
  const out: number[] = [];
  for (const t of tokens) {
    for (const b of t.literals) out.push(b);
    if (t.distance > 0) {
      const len = t.matchLength + minMatch;
      const start = out.length - t.distance;
      for (let i = 0; i < len; i++) {
        out.push(out[start + i]!);
      }
    }
  }
  return out;
}
