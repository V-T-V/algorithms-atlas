// Brotli v2 · 实现（简化：LZ + 上下文频率）
export interface BrotliToken {
  kind: 'lit' | 'match' | 'dict';
  len: number;
  distance?: number;
  ctx?: number;
  literal?: number;
}
export interface BrotliHooks {
  onEmit?: (t: BrotliToken) => void;
}
const STATIC_DICT = new Set(['html', 'head', 'body', 'div', 'span', 'http', 'www', 'com']);
export function brotliEncode(
  input: string,
  windowSize = 32,
  hooks: BrotliHooks = {},
): BrotliToken[] {
  const out: BrotliToken[] = [];
  let pos = 0;
  let prev = 0;
  while (pos < input.length) {
    // 字典词匹配
    let matched = false;
    for (const w of STATIC_DICT) {
      if (input.substr(pos, w.length).toLowerCase() === w) {
        const t: BrotliToken = { kind: 'dict', len: w.length };
        out.push(t);
        hooks.onEmit?.(t);
        pos += w.length;
        matched = true;
        prev = w.charCodeAt(0);
        break;
      }
    }
    if (matched) continue;
    let bestLen = 0;
    let bestDist = 0;
    const start = Math.max(0, pos - windowSize);
    for (let d = 1; d <= pos - start; d++) {
      let len = 0;
      while (pos + len < input.length && input[pos - d + len] === input[pos + len] && len < 64)
        len++;
      if (len > bestLen) {
        bestLen = len;
        bestDist = d;
      }
    }
    if (bestLen >= 4) {
      const t: BrotliToken = { kind: 'match', len: bestLen, distance: bestDist, ctx: prev & 0x3f };
      out.push(t);
      hooks.onEmit?.(t);
      pos += bestLen;
      prev = input.charCodeAt(pos - 1) ?? 0;
    } else {
      const t: BrotliToken = {
        kind: 'lit',
        len: 1,
        literal: input.charCodeAt(pos),
        ctx: prev & 0x3f,
      };
      out.push(t);
      hooks.onEmit?.(t);
      prev = input.charCodeAt(pos);
      pos++;
    }
  }
  return out;
}
