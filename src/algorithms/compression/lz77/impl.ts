// =============================================================================
// LZ77 滑动窗口编码 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露窗口滑动/匹配每一步。
// =============================================================================

/** 一个 LZ77 输出三元组：distance 回退、length 复制长度、next 下一字符。 */
export interface Lz77Token {
  /** 匹配起始相对当前指针的回退距离（0 表示无匹配）。 */
  distance: number;
  /** 匹配长度。 */
  length: number;
  /** 匹配之后的下一字符（用码点表示；输入结束用 -1 表示哨兵）。 */
  next: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Lz77Hooks {
  /** 指针前移到 pos，开始在前看缓冲区找匹配。 */
  onAdvance?: (pos: number) => void;
  /** 在窗口（回退 distance）中发现长度为 length 的匹配。 */
  onMatch?: (pos: number, distance: number, length: number) => void;
  /** 输出一个三元组。 */
  onEmit?: (token: Lz77Token) => void;
}

export interface Lz77Result {
  /** 三元组序列。 */
  tokens: Lz77Token[];
}

/** 把字符串转成码点数组（保留完整 Unicode，便于处理多字节）。 */
export function toCodePoints(s: string): number[] {
  return Array.from(s).map((c) => c.codePointAt(0)!);
}

/**
 * LZ77 编码：滑动窗口 + 前看缓冲区，输出 (distance, length, next) 三元组。
 *
 * 步骤：\n
 * 1. 维护窗口大小 `windowSize`（搜索缓冲区）与前看缓冲区 `lookahead`\n
 * 2. 在每个位置 pos：在搜索缓冲区内寻找与「前看缓冲区」前缀最长的匹配\n
 *    - 匹配可跨越 pos（按字节流式的「自引用」规则，即复制时边读边写）\n
 * 3. 输出 (distance, length, next)：distance 为匹配起点到 pos 的距离，\n
 *    length 为匹配长度，next 为匹配后下一字符的码点（若到末尾则 -1）\n
 * 4. pos 前移 length + 1\n
 *
 * @param input 输入字符串
 * @param windowSize 搜索窗口大小（默认 32，演示用偏小）
 * @param lookahead 前看缓冲区大小（默认 16）
 * @param hooks 可选事件钩子
 * @returns 三元组序列
 */
export function lz77(
  input: string,
  windowSize = 32,
  lookahead = 16,
  hooks: Lz77Hooks = {},
): Lz77Result {
  const data = toCodePoints(input);
  const n = data.length;
  const tokens: Lz77Token[] = [];

  let pos = 0;
  while (pos < n) {
    hooks.onAdvance?.(pos);

    let bestLen = 0;
    let bestDist = 0;
    // 搜索窗口起点
    const winStart = Math.max(0, pos - windowSize);

    // 在 [winStart, pos) 范围内寻找最长匹配
    for (let start = pos - 1; start >= winStart; start--) {
      const dist = pos - start;
      // 匹配长度上限：受前看缓冲区限制，且允许跨越 pos（自引用复制）
      const maxLen = Math.min(lookahead, n - pos);
      let len = 0;
      while (len < maxLen && data[start + len] === data[pos + len]) {
        len++;
      }
      // 注意：start + len 可能 >= pos（自引用），但 data[start+len] 读取的是已「写入」的内容
      // 由于编码时 data 不变，这里 data[pos+len] 仍是原始数据，匹配合法
      if (len > bestLen) {
        bestLen = len;
        bestDist = dist;
      }
    }

    if (bestLen > 0) {
      hooks.onMatch?.(pos, bestDist, bestLen);
    }
    const nextIdx = pos + bestLen;
    const next = nextIdx < n ? data[nextIdx]! : -1;
    const token: Lz77Token = { distance: bestDist, length: bestLen, next };
    tokens.push(token);
    hooks.onEmit?.(token);
    pos += bestLen + 1;
  }

  return { tokens };
}

/**
 * LZ77 解码：按三元组序列还原字符串。
 * 维护已输出缓冲区，对每个 token：从 distance 处复制 length 个字符，再追加 next。
 * 复制允许自引用（边复制边写入），故逐字节处理。
 */
export function lz77Decode(tokens: Lz77Token[]): string {
  const out: number[] = [];
  for (const t of tokens) {
    if (t.distance > 0 && t.length > 0) {
      const start = out.length - t.distance;
      for (let k = 0; k < t.length; k++) {
        out.push(out[start + k]!);
      }
    }
    if (t.next >= 0) out.push(t.next);
  }
  return String.fromCodePoint(...out);
}
