// =============================================================================
// LZO 风格压缩 · 纯算法实现（简化版）
// 滑动窗口 + 最小匹配长度；输出 literal 段与 match 段。
// =============================================================================

export interface LzoMatch {
  /** 匹配段：相对当前位置的回退距离。 */
  distance: number;
  /** 匹配段长度。 */
  length: number;
}
export type LzoToken =
  | { kind: 'lit'; bytes: number[] }
  | { kind: 'match'; distance: number; length: number };

export interface LzoHooks {
  onLiteral?: (pos: number, byte: number) => void;
  onMatch?: (pos: number, distance: number, length: number) => void;
  onFlushLiteral?: (start: number, bytes: number[]) => void;
}

export interface LzoResult {
  tokens: LzoToken[];
}

/** 字符串 → 字节（码点 & 0xff，演示用）。 */
export function toBytes(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0) & 0xff);
}

/**
 * LZO 风格编码：
 *  - 维护搜索窗口 windowSize；
 *  - 在每个位置 pos 寻找最短 minMatch 起的匹配，匹配长度 >= minMatch 则输出 match，否则该字节进入 literal；
 *  - 当遇到匹配或结束时，flush 累积的 literals。
 *
 * @param input 输入字符串
 * @param windowSize 搜索窗口大小（默认 64）
 * @param minMatch 最小匹配长度（默认 3）
 * @param maxMatch 最大匹配长度（默认 18）
 */
export function lzoCompress(
  input: string,
  windowSize = 64,
  minMatch = 3,
  maxMatch = 18,
  hooks: LzoHooks = {},
): LzoResult {
  const data = toBytes(input);
  const n = data.length;
  const tokens: LzoToken[] = [];
  let litStart = -1;
  let litBuf: number[] = [];

  const flushLits = (): void => {
    if (litBuf.length > 0) {
      tokens.push({ kind: 'lit', bytes: [...litBuf] });
      hooks.onFlushLiteral?.(litStart, [...litBuf]);
      litBuf = [];
      litStart = -1;
    }
  };

  let pos = 0;
  while (pos < n) {
    const winStart = Math.max(0, pos - windowSize);
    let bestLen = 0;
    let bestDist = 0;

    if (pos + minMatch <= n) {
      for (let start = pos - 1; start >= winStart; start--) {
        const dist = pos - start;
        const maxLen = Math.min(maxMatch, n - pos);
        let len = 0;
        while (len < maxLen && data[start + len] === data[pos + len]) {
          len++;
        }
        if (len >= minMatch && len > bestLen) {
          bestLen = len;
          bestDist = dist;
        }
      }
    }

    if (bestLen >= minMatch) {
      flushLits();
      hooks.onMatch?.(pos, bestDist, bestLen);
      tokens.push({ kind: 'match', distance: bestDist, length: bestLen });
      pos += bestLen;
    } else {
      if (litBuf.length === 0) litStart = pos;
      hooks.onLiteral?.(pos, data[pos]!);
      litBuf.push(data[pos]!);
      pos++;
    }
  }
  flushLits();

  return { tokens };
}

/** LZO 解码：literal 段直接复制；match 段从已输出缓冲区按 distance/length 复制（允许自引用）。 */
export function lzoDecompress(tokens: LzoToken[]): string {
  const out: number[] = [];
  for (const t of tokens) {
    if (t.kind === 'lit') {
      for (const b of t.bytes) out.push(b);
    } else {
      const start = out.length - t.distance;
      for (let k = 0; k < t.length; k++) out.push(out[start + k]!);
    }
  }
  return String.fromCharCode(...out);
}
