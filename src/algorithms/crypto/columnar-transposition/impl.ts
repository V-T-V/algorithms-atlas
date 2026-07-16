// =============================================================================
// 列置换密码 · 纯算法实现
// =============================================================================

export interface ColumnarHooks {
  onFill?: (row: number, col: number, ch: string) => void;
  onReorder?: (oldCols: number[], newCols: number[]) => void;
  onReadColumn?: (col: number, content: string) => void;
}

export interface ColumnarResult {
  text: string;
}

/** 规范化密钥为大写字母串，空串视为 "A"。 */
export function normalizeKey(key: string): string {
  const cleaned = key.toUpperCase().replace(/[^A-Z]/g, '');
  return cleaned.length === 0 ? 'A' : cleaned;
}

/** 给出密钥各字母的「读取顺序」（按字母升序稳定排列后的原列索引）。 */
export function columnOrder(key: string): number[] {
  const norm = normalizeKey(key);
  const indexed = norm.split('').map((ch, i) => ({ ch, i }));
  // 稳定排序：按字符升序
  indexed.sort((a, b) => (a.ch < b.ch ? -1 : a.ch > b.ch ? 1 : a.i - b.i));
  return indexed.map((x) => x.i);
}

/**
 * 列置换加密：
 *  1) 文本按行填入 width = key.length 的矩阵（不足补 'X'）；
 *  2) 按 columnOrder(key) 给出的列顺序，逐列自上而下读出。
 */
export function columnarEncrypt(
  text: string,
  key: string,
  hooks: ColumnarHooks = {},
): ColumnarResult {
  const norm = normalizeKey(key);
  const width = norm.length;
  const chars = Array.from(text);
  const n = chars.length;
  const rows = Math.ceil(n / width);
  // 补齐为 rows*width
  const padded: string[] = [...chars];
  while (padded.length < rows * width) padded.push('X');

  // 填入矩阵
  const matrix: string[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: string[] = [];
    for (let c = 0; c < width; c++) {
      const ch = padded[r * width + c]!;
      row.push(ch);
      hooks.onFill?.(r, c, ch);
    }
    matrix.push(row);
  }

  const order = columnOrder(key);
  hooks.onReorder?.(
    Array.from({ length: width }, (_, i) => i),
    order,
  );

  let out = '';
  for (const c of order) {
    let col = '';
    for (let r = 0; r < rows; r++) col += matrix[r]![c]!;
    out += col;
    hooks.onReadColumn?.(c, col);
  }
  return { text: out };
}

/**
 * 列置换解密：
 *  1) 用密钥确定列顺序 order 与列数 width、行数 rows；
 *  2) 密文长度 = rows*width（应与加密一致）；
 *  3) 按 order 把密文等分到各列，再按原列序还原矩阵，按行读出。
 */
export function columnarDecrypt(ciphertext: string, key: string): string {
  const norm = normalizeKey(key);
  const width = norm.length;
  const n = ciphertext.length;
  const rows = Math.ceil(n / width);
  const total = rows * width; // 期望长度（加密时补 X）
  // 如果密文长度不足，按规则补 X（实际应一致）
  const padded = ciphertext.padEnd(total, 'X');

  const order = columnOrder(key);
  // 每列长度均为 rows
  const cols: string[] = new Array(width).fill('');
  let idx = 0;
  for (const c of order) {
    cols[c] = padded.slice(idx, idx + rows);
    idx += rows;
  }
  // 按行还原
  let out = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < width; c++) {
      out += cols[c]![r]!;
    }
  }
  return out;
}
