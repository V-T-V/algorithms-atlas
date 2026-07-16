// =============================================================================
// 自动密钥密码 · 纯算法实现（Vigenère 变体）
// =============================================================================

const ALPHA_LEN = 26;
const A_UPPER = 65;
const A_LOWER = 97;

function mod26(n: number): number {
  return ((n % ALPHA_LEN) + ALPHA_LEN) % ALPHA_LEN;
}

export interface AutokeyHooks {
  onChar?: (i: number, plain: string, keyChar: string) => void;
  onMap?: (i: number, plain: string, keyChar: string, cipher: string) => void;
  onSkip?: (i: number, ch: string) => void;
}

export interface AutokeyResult {
  text: string;
  chars: string[];
}

/** 规范化引子为大写字母串。空引子视为 'A'。 */
export function normalizePrimer(primer: string): string {
  const cleaned = primer.toUpperCase().replace(/[^A-Z]/g, '');
  return cleaned.length === 0 ? 'A' : cleaned;
}

/**
 * 自动密钥加密：
 *  - 先用 primer 作为前 primerLen 个字母的密钥；
 *  - 之后把明文字母本身依次作为后续密钥。
 * 非字母字符原样保留且不消耗密钥流位置。
 *
 * 实现细节：维护一个「字母位置」letterPos 与「密钥字符流队列」keyQueue。
 */
export function autokeyEncrypt(
  text: string,
  primer: string,
  hooks: AutokeyHooks = {},
): AutokeyResult {
  const norm = normalizePrimer(primer);
  const chars: string[] = [];
  // 密钥字符队列：primer 各字符 + 动态追加的明文字母（大写）
  const keyQueue: string[] = norm.split('');
  let letterPos = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    if (
      !(code >= A_UPPER && code < A_UPPER + ALPHA_LEN) &&
      !(code >= A_LOWER && code < A_LOWER + ALPHA_LEN)
    ) {
      chars.push(ch);
      hooks.onSkip?.(i, ch);
      continue;
    }
    const isUpper = code >= A_UPPER && code < A_UPPER + ALPHA_LEN;
    const base = isUpper ? A_UPPER : A_LOWER;
    const p = code - base;
    // 密钥流：primer 占据前 primerLen 位，之后是已编码的明文字母自身。
    // keyQueue[0..primerLen) = primer；keyQueue[primerLen..) 追加明文字母。
    const keyChar = keyQueue[letterPos]!;
    const kShift = keyChar.charCodeAt(0) - A_UPPER;
    const c = mod26(p + kShift);
    const out = String.fromCharCode(base + c);
    chars.push(out);
    hooks.onChar?.(i, ch, keyChar);
    hooks.onMap?.(i, ch, keyChar, out);
    // 把当前明文字母（大写）作为后续密钥追加
    keyQueue.push(String.fromCharCode(A_UPPER + p));
    letterPos++;
  }
  return { text: chars.join(''), chars };
}

/** 自动密钥解密：滚动还原。 */
export function autokeyDecrypt(
  text: string,
  primer: string,
  hooks: AutokeyHooks = {},
): AutokeyResult {
  const norm = normalizePrimer(primer);
  const chars: string[] = [];
  const keyQueue: string[] = norm.split('');
  let letterPos = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    if (
      !(code >= A_UPPER && code < A_UPPER + ALPHA_LEN) &&
      !(code >= A_LOWER && code < A_LOWER + ALPHA_LEN)
    ) {
      chars.push(ch);
      hooks.onSkip?.(i, ch);
      continue;
    }
    const isUpper = code >= A_UPPER && code < A_UPPER + ALPHA_LEN;
    const base = isUpper ? A_UPPER : A_LOWER;
    const c = code - base;
    const keyChar = keyQueue[letterPos]!;
    const kShift = keyChar.charCodeAt(0) - A_UPPER;
    const p = mod26(c - kShift);
    const out = String.fromCharCode(base + p);
    chars.push(out);
    hooks.onChar?.(i, ch, keyChar);
    hooks.onMap?.(i, ch, keyChar, out);
    // 解密端把还原出的「明文字母」（大写）追加进队列
    keyQueue.push(String.fromCharCode(A_UPPER + p));
    letterPos++;
  }
  return { text: chars.join(''), chars };
}
