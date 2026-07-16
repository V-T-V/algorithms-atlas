// =============================================================================
// 字符串异位词 · 纯算法实现
// =============================================================================

export interface AnagramHooks {
  /** 在频次表里把字符 c 的计数更新为 v。 */
  onCount?: (ch: string, count: number) => void;
  /** 比较阶段发现差异。 */
  onDiff?: (ch: string) => void;
  onResult?: (isAnagram: boolean) => void;
  /** 分组时确定某串的签名。 */
  onKey?: (s: string, key: string) => void;
}

/** 判定 a 与 b 是否为异位词（频次法，O(n)）。 */
export function isAnagram(a: string, b: string, hooks: AnagramHooks = {}): boolean {
  if (a.length !== b.length) {
    hooks.onResult?.(false);
    return false;
  }
  const freq = new Map<string, number>();
  for (const ch of a) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  for (const [ch, c] of freq) hooks.onCount?.(ch, c);
  for (const ch of b) {
    const c = freq.get(ch) ?? 0;
    if (c === 0) {
      hooks.onDiff?.(ch);
      hooks.onResult?.(false);
      return false;
    }
    freq.set(ch, c - 1);
  }
  hooks.onResult?.(true);
  return true;
}

/** 用排序后的串作为签名（教学常用）。 */
export function anagramKey(s: string): string {
  return [...s].sort().join('');
}

/** 把一组字符串按异位词分组。返回二维数组。 */
export function groupAnagrams(strs: string[], hooks: AnagramHooks = {}): string[][] {
  const map = new Map<string, string[]>();
  for (const s of strs) {
    const key = anagramKey(s);
    hooks.onKey?.(s, key);
    const arr = map.get(key);
    if (arr) arr.push(s);
    else map.set(key, [s]);
  }
  return [...map.values()];
}

/** 用频次编码做签名（避免排序，对长串更优）。格式：#a1b2... */
export function anagramKeyFreq(s: string): string {
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  const keys = [...freq.keys()].sort();
  let out = '';
  for (const k of keys) out += `${k}${freq.get(k)}`;
  return out;
}
