// =============================================================================
// Polybius 方阵密码 · 纯算法实现
// =============================================================================

/** 标准 5×5 字母表（I 与 J 合并，用 I 代表 I/J）。 */
const SQUARE_5x5 = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // 无 J，长度 25
const A_UPPER = 65;

/** 把明文字母预处理：大写、J→I、丢弃非字母。 */
export function cleanText(text: string): string {
  return text
    .toUpperCase()
    .replace(/J/g, 'I')
    .replace(/[^A-Z]/g, '');
}

/** 字母 → (row, col)，1-based；未找到返回 null。J 视作 I（与方阵合并一致）。 */
export function letterToCoord(letter: string): { row: number; col: number } | null {
  const target = letter === 'J' ? 'I' : letter;
  const idx = SQUARE_5x5.indexOf(target);
  if (idx < 0) return null;
  return { row: Math.floor(idx / 5) + 1, col: (idx % 5) + 1 };
}

/** (row, col) 1-based → 字母（I 代表 I/J）。 */
export function coordToLetter(row: number, col: number): string {
  const idx = (row - 1) * 5 + (col - 1);
  return SQUARE_5x5[idx]!;
}

export interface PolybiusHooks {
  onEncode?: (i: number, letter: string, row: number, col: number, digits: string) => void;
  onSkip?: (i: number, ch: string) => void;
  onDecode?: (digits: string, letter: string) => void;
}

export interface PolybiusResult {
  /** 加密结果：两位数字字符串。 */
  text: string;
}

/**
 * Polybius 加密：每个字母 → "rowcol" 两位数字。
 * 非字母被丢弃（可在 hook 中观察）。
 */
export function polybiusEncrypt(text: string, hooks: PolybiusHooks = {}): PolybiusResult {
  const upper = text.toUpperCase();
  let out = '';
  let outIdx = 0;
  for (let i = 0; i < upper.length; i++) {
    let ch = upper[i]!;
    if (ch === 'J') ch = 'I';
    const code = ch.charCodeAt(0);
    if (code < A_UPPER || code > A_UPPER + 25) {
      hooks.onSkip?.(i, upper[i]!);
      continue;
    }
    const c = letterToCoord(ch);
    if (!c) {
      hooks.onSkip?.(i, upper[i]!);
      continue;
    }
    const digits = `${c.row}${c.col}`;
    out += digits;
    hooks.onEncode?.(outIdx, ch, c.row, c.col, digits);
    outIdx++;
  }
  return { text: out };
}

/** Polybius 解密：每两位数字 → 字母。奇数长度时忽略最后一个孤立数字。 */
export function polybiusDecrypt(digits: string, hooks: PolybiusHooks = {}): string {
  const cleaned = digits.replace(/[^0-9]/g, '');
  let out = '';
  for (let i = 0; i + 1 < cleaned.length; i += 2) {
    const row = Number(cleaned[i]!);
    const col = Number(cleaned[i + 1]!);
    if (row < 1 || row > 5 || col < 1 || col > 5) continue;
    const letter = coordToLetter(row, col);
    out += letter;
    hooks.onDecode?.(`${row}${col}`, letter);
  }
  return out;
}
