// =============================================================================
// Brotli 风格字典压缩 · 纯算法实现（简化）
// 用一张静态小字典把高频子串替换成引用。
// =============================================================================

/** 演示用静态字典（Brotli 真实字典有数万条目）。 */
export const DICTIONARY: readonly string[] = [
  'http',
  'https',
  'html',
  'body',
  'head',
  'div',
  'span',
  'class',
  'id',
  'the',
  'ing',
  'and',
  'tion',
  'com',
  'www',
  'text',
];

export type BrotliDictToken =
  | { kind: 'lit'; bytes: number[] }
  | { kind: 'dict'; index: number; length: number };

export interface BrotliDictHooks {
  onLiteral?: (pos: number, byte: number) => void;
  onDictRef?: (pos: number, index: number, word: string, length: number) => void;
  onFlushLiteral?: (start: number, bytes: number[]) => void;
}

export interface BrotliDictResult {
  tokens: BrotliDictToken[];
}

/** 字符串 → 字节（码点 & 0xff）。 */
export function toBytes(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0) & 0xff);
}

/**
 * Brotli 风格字典编码：在每位置尝试字典中最长的匹配（长度 >= minMatch），
 * 命中则输出 dict 引用并跳过对应字符；否则该字节进入 literal 段。
 */
export function brotliDictCompress(
  input: string,
  dictionary: readonly string[] = DICTIONARY,
  minMatch = 3,
  hooks: BrotliDictHooks = {},
): BrotliDictResult {
  const data = toBytes(input);
  const n = data.length;
  const tokens: BrotliDictToken[] = [];
  let litBuf: number[] = [];
  let litStart = -1;

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
    let bestIndex = -1;
    let bestLen = 0;
    for (let k = 0; k < dictionary.length; k++) {
      const word = dictionary[k]!;
      const wb = toBytes(word);
      const maxLen = Math.min(wb.length, n - pos);
      if (maxLen < minMatch) continue;
      let len = 0;
      while (len < maxLen && wb[len] === data[pos + len]) len++;
      if (len >= minMatch && len > bestLen) {
        bestLen = len;
        bestIndex = k;
      }
    }

    if (bestIndex >= 0) {
      flushLits();
      const word = dictionary[bestIndex]!;
      hooks.onDictRef?.(pos, bestIndex, word, bestLen);
      tokens.push({ kind: 'dict', index: bestIndex, length: bestLen });
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

/** 字典解码：literal 直接复制；dict 引用按 index/length 从字典取字节数组。 */
export function brotliDictDecompress(
  tokens: BrotliDictToken[],
  dictionary: readonly string[] = DICTIONARY,
): string {
  const out: number[] = [];
  for (const t of tokens) {
    if (t.kind === 'lit') {
      for (const b of t.bytes) out.push(b);
    } else {
      const word = dictionary[t.index]!;
      const wb = toBytes(word);
      for (let i = 0; i < t.length; i++) out.push(wb[i % wb.length]!);
    }
  }
  return String.fromCharCode(...out);
}
