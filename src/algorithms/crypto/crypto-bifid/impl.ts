// =============================================================================
// Bifid 双方阵密码 · 纯算法实现
// 5×5 方阵（I/J 合并）。加密：
//  1. 每字母 -> (row, col)
//  2. 把所有 row 拼成上行、col 拼成下行
//  3. 上下两行两两成对 (r,c) 回查方阵得密文
// =============================================================================
const A_UPPER = 65;

export function buildBifidSquare(keyword = ''): string[] {
  const seen = new Set<string>();
  const cells: string[] = [];
  const push = (ch: string) => {
    if (ch === 'J') ch = 'I';
    if (!seen.has(ch)) {
      seen.add(ch);
      cells.push(ch);
    }
  };
  for (const ch of keyword.toUpperCase()) {
    const code = ch.charCodeAt(0);
    if (code >= A_UPPER && code < A_UPPER + 26) push(ch);
  }
  for (let c = A_UPPER; c < A_UPPER + 26; c++) push(String.fromCharCode(c));
  return cells;
}

export interface BifidHooks {
  onSquare?: (cells: string[]) => void;
  onSplit?: (rows: number[], cols: number[]) => void;
  onChar?: (i: number, original: string, mapped: string) => void;
}

export function bifidEncrypt(text: string, keyword = '', hooks: BifidHooks = {}): string {
  const cells = buildBifidSquare(keyword);
  hooks.onSquare?.(cells);
  const charToRC = new Map<string, [number, number]>();
  for (let i = 0; i < 25; i++) {
    charToRC.set(cells[i]!, [Math.floor(i / 5), i % 5]);
  }
  // 只取字母（J->I），记录其原字母
  const letters: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const up = text[i]!.toUpperCase();
    if (up >= 'A' && up <= 'Z') letters.push(up === 'J' ? 'I' : up);
  }
  const rows: number[] = [];
  const cols: number[] = [];
  for (const ch of letters) {
    const [r, c] = charToRC.get(ch)!;
    rows.push(r);
    cols.push(c);
  }
  hooks.onSplit?.(rows, cols);

  // 拼成一行后两两取坐标回查
  const combined = [...rows, ...cols];
  let out = '';
  for (let i = 0; i + 1 < combined.length; i += 2) {
    const r = combined[i]!;
    const c = combined[i + 1]!;
    out += cells[r * 5 + c]!;
  }
  return out;
}
