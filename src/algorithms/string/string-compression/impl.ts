// =============================================================================
// 字符串压缩（Run-Length 风格原地压缩）· 纯算法实现
// 把连续重复字符压缩成「字符 + 次数」，如 "aabcccccaaa" → "a2b1c5a3"。
// 单个字符也计数（保持可逆）；若压缩后更长则返回原串（可选策略）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface StringCompressionHooks {
  /** 输出一个压缩段：字符 ch 出现 count 次。 */
  onSegment?: (ch: string, count: number) => void;
  /** 写入字符 ch 到结果。 */
  onWrite?: (ch: string) => void;
  /** 计算完成。 */
  onDone?: (compressed: string) => void;
}

/**
 * 字符串压缩：把连续重复字符压成「字符+次数」。
 *
 * 规则：相邻相同字符合并；每段输出字符本身和十进制次数。
 * 当压缩结果不比原串短时，仍返回压缩结果（便于演示与可逆）。
 * 时间 O(n)，空间 O(压缩后长度)。
 *
 * @returns 压缩后的字符串
 */
export function stringCompression(s: string, hooks: StringCompressionHooks = {}): string {
  if (s.length === 0) {
    hooks.onDone?.('');
    return '';
  }
  const parts: string[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i]!;
    let count = 1;
    while (i + count < s.length && s[i + count] === ch) count++;
    hooks.onSegment?.(ch, count);
    parts.push(ch);
    hooks.onWrite?.(ch);
    const digits = String(count);
    parts.push(digits);
    for (const d of digits) hooks.onWrite?.(d);
    i += count;
  }
  const compressed = parts.join('');
  hooks.onDone?.(compressed);
  return compressed;
}

/** 解压：把 "a2b1c5a3" 还原成 "aabcccccaaa"。 */
export function decompress(compressed: string): string {
  let result = '';
  let i = 0;
  while (i < compressed.length) {
    const ch = compressed[i]!;
    i++;
    let numStr = '';
    while (i < compressed.length && compressed[i]! >= '0' && compressed[i]! <= '9') {
      numStr += compressed[i];
      i++;
    }
    const count = numStr === '' ? 1 : parseInt(numStr, 10);
    result += ch.repeat(count);
  }
  return result;
}
