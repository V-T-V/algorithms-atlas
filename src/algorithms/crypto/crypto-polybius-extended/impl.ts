// =============================================================================
// 扩展波利比奥斯方阵 · 纯算法实现
// 5×5 方阵；I/J 共用一格。可由关键字打乱。明文字母 -> 两位数字坐标。
// =============================================================================
const A_UPPER = 65;

/** 构造 5x5 字母序列（25 格，I/J 合并）。可选关键字打乱。 */
export function buildPolybiusSquare(keyword = ''): string[] {
  const seen = new Set<string>();
  const cells: string[] = [];
  const push = (ch: string) => {
    if (ch === 'J') ch = 'I'; // I/J 合并
    if (!seen.has(ch)) {
      seen.add(ch);
      cells.push(ch);
    }
  };
  for (const ch of keyword.toUpperCase()) {
    const code = ch.charCodeAt(0);
    if (code >= A_UPPER && code < A_UPPER + 26) push(ch);
  }
  for (let c = A_UPPER; c < A_UPPER + 26; c++) {
    push(String.fromCharCode(c));
  }
  return cells; // 长度 25
}

export interface PolybiusExtHooks {
  onSquare?: (cells: string[]) => void;
  onChar?: (i: number, original: string, code: string) => void;
}

/** 加密：字母 -> 两位坐标（行=十位，列=个位，均 1..5）。 */
export function polybiusEncrypt(text: string, keyword = '', hooks: PolybiusExtHooks = {}): string {
  const cells = buildPolybiusSquare(keyword);
  hooks.onSquare?.(cells);
  const pos = new Map<string, string>();
  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / 5) + 1;
    const col = (i % 5) + 1;
    pos.set(cells[i]!, `${row}${col}`);
  }
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!.toUpperCase();
    if (ch === 'J' ? true : ch >= 'A' && ch <= 'Z') {
      const key = ch === 'J' ? 'I' : ch;
      const code = pos.get(key)!;
      out += code;
      hooks.onChar?.(i, text[i]!, code);
    }
  }
  return out;
}
