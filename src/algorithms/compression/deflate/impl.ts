// =============================================================================
// DEFLATE（玩具版）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 教学版：演示 LZ77 滑窗 + Huffman 两阶段思想，输出 (literal | match) token 序列。
// =============================================================================

/** Token：要么是字面量，要么是 (距离, 长度) 匹配。 */
export type Token =
  | { kind: 'lit'; ch: number }
  | { kind: 'match'; length: number; distance: number };

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DeflateHooks {
  onLiteral?: (pos: number, ch: number) => void;
  onMatch?: (pos: number, length: number, distance: number) => void;
}

export interface DeflateResult {
  /** LZ77 阶段输出的 token 序列。 */
  tokens: Token[];
}

/** 在窗口 [start, pos) 中查找与 buf[pos,pos+maxLen) 的最长匹配。 */
function findLongest(
  buf: number[],
  pos: number,
  windowSize: number,
  maxLen: number,
): { length: number; distance: number } {
  const start = Math.max(0, pos - windowSize);
  let bestLen = 0;
  let bestDist = 0;
  for (let i = start; i < pos; i++) {
    let l = 0;
    while (l < maxLen && pos + l < buf.length && buf[i + l] === buf[pos + l]!) l++;
    if (l > bestLen) {
      bestLen = l;
      bestDist = pos - i;
    }
  }
  return { length: bestLen, distance: bestDist };
}

/**
 * 玩具版 DEFLATE 的 LZ77 阶段：在滑动窗口内做最长匹配，输出 token。
 * （真实 DEFLATE 还会对 token 做 Huffman 编码，本演示聚焦 LZ77。）
 * @param data 字节序列
 * @param windowSize 窗口大小（默认 32，教学用小窗）
 * @param minMatch 最小匹配长度（默认 3）
 * @param hooks 可选的事件钩子
 */
export function deflate(
  data: number[],
  windowSize = 32,
  minMatch = 3,
  hooks: DeflateHooks = {},
): DeflateResult {
  const tokens: Token[] = [];
  let pos = 0;
  while (pos < data.length) {
    const { length, distance } = findLongest(data, pos, windowSize, windowSize);
    if (length >= minMatch) {
      tokens.push({ kind: 'match', length, distance });
      hooks.onMatch?.(pos, length, distance);
      pos += length;
    } else {
      tokens.push({ kind: 'lit', ch: data[pos]! });
      hooks.onLiteral?.(pos, data[pos]!);
      pos++;
    }
  }
  return { tokens };
}

/** 用 token 还原原始字节（LZ77 解码）。 */
export function inflate(tokens: Token[]): number[] {
  const out: number[] = [];
  for (const t of tokens) {
    if (t.kind === 'lit') {
      out.push(t.ch);
    } else {
      const start = out.length - t.distance;
      for (let k = 0; k < t.length; k++) out.push(out[start + k]!);
    }
  }
  return out;
}
