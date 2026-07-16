// =============================================================================
// LZSS 压缩 · 纯算法实现
// 定长回引 + 1 位标志位区分字面量与回引。
// =============================================================================

export interface LzssToken {
  /** true = 回引，false = 字面量。 */
  isMatch: boolean;
  /** 字面量字节值（isMatch=false 时有效）。 */
  literal?: number;
  /** 回引距离（isMatch=true 时有效）。 */
  distance?: number;
  /** 回引长度（isMatch=true 时有效）。 */
  length?: number;
}

export interface LzssHooks {
  onToken?: (pos: number, token: LzssToken) => void;
}

export interface LzssOptions {
  windowSize?: number; // 窗口（最大距离），默认 4096
  minMatch?: number; // 最小匹配长度，默认 3
  maxMatch?: number; // 最大匹配长度，默认 18
}

/**
 * LZSS 压缩：扫描输入，在窗口内贪心找最长匹配。
 * 匹配长度 >= minMatch 则输出回引，否则输出字面量。
 */
export function lzssCompress(
  data: readonly number[],
  opts: LzssOptions = {},
  hooks: LzssHooks = {},
): LzssToken[] {
  const windowSize = opts.windowSize ?? 12; // 演示用小窗口
  const minMatch = opts.minMatch ?? 2;
  const maxMatch = opts.maxMatch ?? 6;
  const tokens: LzssToken[] = [];
  let pos = 0;

  while (pos < data.length) {
    const winStart = Math.max(0, pos - windowSize);
    let bestLen = 0;
    let bestDist = 0;

    // 在窗口内查找最长匹配
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
      const token: LzssToken = { isMatch: true, distance: bestDist, length: bestLen };
      tokens.push(token);
      hooks.onToken?.(pos, token);
      pos += bestLen;
    } else {
      const token: LzssToken = { isMatch: false, literal: data[pos] };
      tokens.push(token);
      hooks.onToken?.(pos, token);
      pos++;
    }
  }
  return tokens;
}

/** LZSS 解压。 */
export function lzssDecompress(tokens: readonly LzssToken[]): number[] {
  const out: number[] = [];
  for (const t of tokens) {
    if (t.isMatch) {
      const dist = t.distance!;
      const len = t.length!;
      const start = out.length - dist;
      for (let i = 0; i < len; i++) {
        out.push(out[start + i]!);
      }
    } else {
      out.push(t.literal!);
    }
  }
  return out;
}
