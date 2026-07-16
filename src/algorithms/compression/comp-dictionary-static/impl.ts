// =============================================================================
// 静态字典压缩 · 纯算法实现
// =============================================================================

export type StaticDict = Map<string, number>;

export interface StaticDictHooks {
  onMatch?: (text: string, code: number) => void;
  onLiteral?: (ch: string) => void;
}

/** 默认演示字典（高频英文词 → 短码）。 */
export const DEFAULT_DICT: StaticDict = new Map<string, number>([
  ['the', 1],
  ['and', 2],
  ['ing', 3],
  ['tion', 4],
  ['http', 5],
  ['html', 6],
]);

/** 编码：贪心最长匹配。码 < 32768 表示字典项；>= 32768 + charCode 表示字面量。 */
export function staticDictEncode(
  text: string,
  dict: StaticDict = DEFAULT_DICT,
  hooks: StaticDictHooks = {},
): number[] {
  const out: number[] = [];
  let i = 0;
  const maxLen = Math.max(...[...dict.keys()].map((k) => k.length));
  while (i < text.length) {
    let matched = false;
    for (let L = Math.min(maxLen, text.length - i); L >= 1; L--) {
      const sub = text.slice(i, i + L);
      if (dict.has(sub)) {
        out.push(dict.get(sub)!);
        hooks.onMatch?.(sub, dict.get(sub)!);
        i += L;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const ch = text[i]!;
      out.push(32768 + ch.charCodeAt(0));
      hooks.onLiteral?.(ch);
      i++;
    }
  }
  return out;
}

export function staticDictDecode(
  codes: readonly number[],
  dict: StaticDict = DEFAULT_DICT,
): string {
  const rev = new Map<number, string>();
  for (const [k, v] of dict) rev.set(v, k);
  let out = '';
  for (const c of codes) {
    if (c < 32768) {
      out += rev.get(c) ?? '';
    } else {
      out += String.fromCharCode(c - 32768);
    }
  }
  return out;
}
