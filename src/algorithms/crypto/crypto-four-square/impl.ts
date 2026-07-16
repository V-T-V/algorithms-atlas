// =============================================================================
// 四方密码 · 纯算法实现
// =============================================================================
const A_UPPER = 65;

/** 构造 5×5 方阵字符序列（I/J 合并），可由关键字打乱。 */
function buildSquare(keyword = ''): string[] {
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

export interface FourSquareHooks {
  onDigraph?: (i: number, a: string, b: string, ca: string, cb: string) => void;
}

/** 查找字符在方阵中的 (row, col)。 */
function locate(cells: string[], ch: string): [number, number] {
  const idx = cells.indexOf(ch);
  return [Math.floor(idx / 5), idx % 5];
}

export function fourSquareEncrypt(
  text: string,
  kw1 = '',
  kw2 = '',
  hooks: FourSquareHooks = {},
): string {
  const tl = buildSquare(''); // 标准
  const br = buildSquare(''); // 标准
  const tr = buildSquare(kw1); // 关键字方阵
  const bl = buildSquare(kw2);
  // 收集字母
  const letters: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const up = text[i]!.toUpperCase();
    if (up >= 'A' && up <= 'Z') letters.push(up === 'J' ? 'I' : up);
  }
  // 补齐偶数长度
  if (letters.length % 2 === 1) letters.push('X');
  let out = '';
  for (let i = 0; i < letters.length; i += 2) {
    const a = letters[i]!;
    const b = letters[i + 1]!;
    const [r1, c1] = locate(tl, a);
    const [r2, c2] = locate(br, b);
    const ca = tr[r1 * 5 + c2]!;
    const cb = bl[r2 * 5 + c1]!;
    out += ca + cb;
    hooks.onDigraph?.(i, a, b, ca, cb);
  }
  return out;
}
