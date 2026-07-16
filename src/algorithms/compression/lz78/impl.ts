// =============================================================================
// LZ78 字典压缩 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 一个 LZ78 输出二元组：字典索引 + 新字符。 */
export interface Lz78Token {
  /** 引用字典中已有条目的索引（0 表示空串）。 */
  index: number;
  /** 该步新增到字典的字符（用码点表示；若输入已耗尽则为 -1）。 */
  char: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Lz78Hooks {
  /** 在位置 pos 处开始查找最长前缀。 */
  onAdvance?: (pos: number) => void;
  /** 找到最长前缀（字典索引 index、前缀字符串 prefix），下一字符为 newChar。 */
  onMatch?: (pos: number, index: number, prefix: string, newChar: number) => void;
  /** 新增字典条目（编号 = 新条目的索引，从 1 起）。 */
  onAddEntry?: (entryIndex: number, entry: string) => void;
  /** 输出一个二元组。 */
  onEmit?: (token: Lz78Token) => void;
}

export interface Lz78Result {
  /** 二元组序列。 */
  tokens: Lz78Token[];
  /** 最终字典（下标 0 为空串）。 */
  dictionary: string[];
}

/** 把字符串转成码点数组（保留完整 Unicode）。 */
export function toCodePoints(s: string): number[] {
  return Array.from(s).map((c) => c.codePointAt(0)!);
}

/**
 * LZ78 编码：维护一个字符串字典（下标 0 = 空串）。
 * 每步在剩余输入中查找字典里的最长前缀，输出 (index, char)，并把 prefix+char 加入字典。
 *
 * @param input 输入字符串
 * @param hooks 可选事件钩子
 * @returns 二元组序列 + 最终字典
 */
export function lz78(input: string, hooks: Lz78Hooks = {}): Lz78Result {
  const data = toCodePoints(input);
  const n = data.length;
  const dictionary: string[] = ['']; // 索引 0 = 空串
  const tokens: Lz78Token[] = [];

  let pos = 0;
  while (pos < n) {
    hooks.onAdvance?.(pos);

    // 找字典中作为 data[pos..] 最长前缀的条目
    let bestIndex = 0;
    let bestLen = 0;
    for (let k = 1; k < dictionary.length; k++) {
      const entry = dictionary[k]!;
      const entryPts = toCodePoints(entry);
      // 比较 entry 与 data[pos..pos+entryPts.length)
      let i = 0;
      while (i < entryPts.length && pos + i < n && entryPts[i] === data[pos + i]) {
        i++;
      }
      if (i > bestLen) {
        bestLen = i;
        bestIndex = k;
      }
    }

    const prefix = dictionary[bestIndex]!;
    const newCharPos = pos + bestLen;
    const newChar = newCharPos < n ? data[newCharPos]! : -1;

    hooks.onMatch?.(pos, bestIndex, prefix, newChar);

    const token: Lz78Token = { index: bestIndex, char: newChar };
    tokens.push(token);
    hooks.onEmit?.(token);

    // 加入新条目 prefix + newChar（若 newChar === -1 则是末尾，不入库）
    if (newChar >= 0) {
      const newEntry = prefix + String.fromCodePoint(newChar);
      dictionary.push(newEntry);
      hooks.onAddEntry?.(dictionary.length - 1, newEntry);
    }

    pos += bestLen + 1;
  }

  return { tokens, dictionary };
}

/**
 * LZ78 解码：按二元组序列还原字符串。
 * 维护与编码端相同的字典（下标 0 = 空串），每步：取出 dict[index]，追加 char，再插入新条目。
 */
export function lz78Decode(tokens: Lz78Token[]): string {
  const dictionary: string[] = [''];
  let out = '';
  for (const t of tokens) {
    const prefix = dictionary[t.index]!;
    const ch = t.char >= 0 ? String.fromCodePoint(t.char) : '';
    const piece = prefix + ch;
    out += piece;
    if (t.char >= 0) dictionary.push(piece);
  }
  return out;
}
