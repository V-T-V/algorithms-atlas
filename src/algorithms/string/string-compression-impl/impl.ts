// =============================================================================
// 字符串压缩（Run-Length Encoding）· 纯算法实现
// 双指针原地改写，返回新长度。零 DOM 依赖，可独立单测。
// =============================================================================

export interface CompressionHooks {
  /** 识别到一段连续字符 [start, end)，字符 ch。 */
  onRun?: (start: number, end: number, ch: string) => void;
  /** 写入一个字符 c 到结果位置 write。 */
  onWriteChar?: (write: number, c: string) => void;
  /** 写入计数的各位数字。 */
  onWriteCount?: (writeStart: number, count: number) => void;
}

/**
 * 原地压缩字符数组 chars，返回压缩后长度。
 * 每段写「字符 +（次数>1 时）次数的十进制各位」。
 * 时间 O(n)，空间 O(1)。
 *
 * @param chars 字符数组（会被原地修改前 newLength 个位置）
 * @param hooks 可选事件钩子
 * @returns 压缩后数组的有效长度
 */
export function compress(chars: string[], hooks: CompressionHooks = {}): number {
  const n = chars.length;
  let write = 0; // 写指针
  let read = 0; // 读指针（每组起点）

  while (read < n) {
    const ch = chars[read]!;
    let end = read;
    while (end < n && chars[end] === ch) end++;
    const count = end - read;
    hooks.onRun?.(read, end, ch);

    // 写字符
    chars[write] = ch;
    hooks.onWriteChar?.(write, ch);
    write++;

    // 写次数（>1 时）
    if (count > 1) {
      const digits = String(count);
      const writeStart = write;
      for (const d of digits) {
        chars[write] = d;
        hooks.onWriteChar?.(write, d);
        write++;
      }
      hooks.onWriteCount?.(writeStart, count);
    }
    read = end;
  }
  return write;
}

/** 便利函数：返回压缩后的字符串（不改原数组语义，便于断言）。 */
export function compressToString(chars: readonly string[]): string {
  const copy = [...chars];
  const len = compress(copy);
  return copy.slice(0, len).join('');
}
