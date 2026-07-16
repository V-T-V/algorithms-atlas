// LZO v2 · 实现（简化）
export interface LzoToken {
  kind: 'lit' | 'match' | 'run';
  len: number;
  distance?: number;
  literal?: number;
}
export interface LzoHooks {
  onEmit?: (t: LzoToken) => void;
  onRun?: (pos: number, len: number) => void;
}
export function lzoEncode(input: string, hooks: LzoHooks = {}): LzoToken[] {
  const out: LzoToken[] = [];
  const codes = input.split('').map((c) => c.charCodeAt(0));
  let pos = 0;
  while (pos < codes.length) {
    // 检测 RLE run（同字符连续）
    let runLen = 1;
    while (pos + runLen < codes.length && codes[pos + runLen] === codes[pos] && runLen < 256)
      runLen++;
    if (runLen >= 4) {
      hooks.onRun?.(pos, runLen);
      const t: LzoToken = { kind: 'run', len: runLen, literal: codes[pos] };
      out.push(t);
      hooks.onEmit?.(t);
      pos += runLen;
      continue;
    }
    // 检测回看匹配
    let bestLen = 0;
    let bestDist = 0;
    for (let d = 1; d <= pos; d++) {
      let len = 0;
      while (pos + len < codes.length && codes[pos - d + len] === codes[pos + len] && len < 64)
        len++;
      if (len > bestLen) {
        bestLen = len;
        bestDist = d;
      }
    }
    if (bestLen >= 3) {
      const t: LzoToken = { kind: 'match', len: bestLen, distance: bestDist };
      out.push(t);
      hooks.onEmit?.(t);
      pos += bestLen;
    } else {
      const t: LzoToken = { kind: 'lit', len: 1, literal: codes[pos] };
      out.push(t);
      hooks.onEmit?.(t);
      pos++;
    }
  }
  return out;
}
