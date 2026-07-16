// =============================================================================
// Snappy (简化) · 纯算法实现
// 两种 token：字面量段 与 回引(距离+长度)。
// =============================================================================

export interface SnappyToken {
  type: 'literal' | 'copy';
  literals?: number[];
  distance?: number;
  length?: number;
}

export interface SnappyHooks {
  onToken?: (pos: number, token: SnappyToken) => void;
}

export interface SnappyOptions {
  windowSize?: number;
  minMatch?: number;
  maxMatch?: number;
}

export function snappyCompress(
  data: readonly number[],
  opts: SnappyOptions = {},
  hooks: SnappyHooks = {},
): SnappyToken[] {
  const windowSize = opts.windowSize ?? 16;
  const minMatch = opts.minMatch ?? 4;
  const maxMatch = opts.maxMatch ?? 64;
  const tokens: SnappyToken[] = [];
  let pos = 0;
  let literalStart = 0;

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
      const lits = data.slice(literalStart, pos);
      if (lits.length > 0) {
        tokens.push({ type: 'literal', literals: [...lits] });
      }
      const tok: SnappyToken = { type: 'copy', distance: bestDist, length: bestLen };
      tokens.push(tok);
      hooks.onToken?.(pos, tok);
      pos += bestLen;
      literalStart = pos;
    } else {
      pos++;
    }
  }
  if (literalStart < data.length) {
    tokens.push({ type: 'literal', literals: [...data.slice(literalStart)] });
  }
  return tokens;
}

export function snappyDecompress(tokens: readonly SnappyToken[]): number[] {
  const out: number[] = [];
  for (const t of tokens) {
    if (t.type === 'literal') {
      for (const b of t.literals ?? []) out.push(b);
    } else {
      const start = out.length - (t.distance ?? 0);
      for (let i = 0; i < (t.length ?? 0); i++) {
        out.push(out[start + i]!);
      }
    }
  }
  return out;
}
