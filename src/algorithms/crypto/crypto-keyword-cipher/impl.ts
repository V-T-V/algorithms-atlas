// =============================================================================
// 关键字密码 · 纯算法实现
// 由 keyword 生成 26 字母映射表（大写），大小写各自映射，非字母保留。
// =============================================================================
const A_UPPER = 65;
const A_LOWER = 97;

/** 由关键字构造长度 26 的大写替换表（去重后补全 A-Z）。 */
export function buildKeywordTable(keyword: string): string[] {
  const seen = new Set<string>();
  const table: string[] = [];
  for (const ch of keyword.toUpperCase()) {
    const code = ch.charCodeAt(0);
    if (code >= A_UPPER && code < A_UPPER + 26 && !seen.has(ch)) {
      seen.add(ch);
      table.push(ch);
    }
  }
  for (let c = A_UPPER; c < A_UPPER + 26; c++) {
    const ch = String.fromCharCode(c);
    if (!seen.has(ch)) table.push(ch);
  }
  return table;
}

export interface KeywordHooks {
  onTable?: (table: string[]) => void;
  onChar?: (i: number, original: string, mapped: string) => void;
}

export function keywordEncrypt(text: string, keyword: string, hooks: KeywordHooks = {}): string {
  const table = buildKeywordTable(keyword);
  hooks.onTable?.(table);
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    let mapped = ch;
    if (code >= A_UPPER && code < A_UPPER + 26) {
      mapped = table[code - A_UPPER]!;
    } else if (code >= A_LOWER && code < A_LOWER + 26) {
      mapped = table[code - A_LOWER]!.toLowerCase();
    }
    out += mapped;
    hooks.onChar?.(i, ch, mapped);
  }
  return out;
}

export function keywordDecrypt(text: string, keyword: string, hooks: KeywordHooks = {}): string {
  const table = buildKeywordTable(keyword);
  hooks.onTable?.(table);
  const inverse = new Map<string, number>();
  for (let i = 0; i < 26; i++) inverse.set(table[i]!, i);
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const up = ch.toUpperCase();
    let mapped = ch;
    if (inverse.has(up)) {
      const idx = inverse.get(up)!;
      if (ch >= 'A' && ch <= 'Z') {
        mapped = String.fromCharCode(A_UPPER + idx);
      } else if (ch >= 'a' && ch <= 'z') {
        mapped = String.fromCharCode(A_LOWER + idx);
      }
    }
    out += mapped;
    hooks.onChar?.(i, ch, mapped);
  }
  return out;
}
