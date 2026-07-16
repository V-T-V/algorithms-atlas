// =============================================================================
// 维吉尼亚密码 Vigenère Cipher · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露逐字符位移过程，供录制器使用。
// =============================================================================

const ALPHA_LEN = 26;
const A_UPPER = 65; // 'A'.charCodeAt(0)
const A_LOWER = 97; // 'a'.charCodeAt(0)

/** 把一个整数规范化到 [0, 25] 区间（处理负位移）。 */
function mod26(n: number): number {
  return ((n % ALPHA_LEN) + ALPHA_LEN) % ALPHA_LEN;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface VigenereHooks {
  /** 开始处理第 i 个字符（字符原文 original，使用的密钥字母 keyChar，其位移 keyShift）。 */
  onChar?: (i: number, original: string, keyChar: string, keyShift: number) => void;
  /** 对字符 original 应用位移 keyShift 得到 shifted。 */
  onShift?: (i: number, original: string, shifted: string, keyChar: string) => void;
  /** 跳过非字母字符（不消耗密钥字母）。 */
  onSkip?: (i: number, ch: string) => void;
}

export interface VigenereResult {
  /** 加密/解密后的文本。 */
  text: string;
  /** 逐字符结果（与输入等长，非字母原样保留）。 */
  chars: string[];
}

/** 把密钥规范化为大写字母串（去掉所有非字母字符）。空密钥视为 'A'（位移 0）。 */
export function normalizeKey(key: string): string {
  const cleaned = key.toUpperCase().replace(/[^A-Z]/g, '');
  return cleaned.length === 0 ? 'A' : cleaned;
}

/**
 * 维吉尼亚密码：多表替换。每个明文字母按「对应密钥字母」在字母表中的位置进行平移。
 *
 *   C_i = (P_i + K_{i mod keyLen}) mod 26   （加密，sign = +1）
 *   P_i = (C_i - K_{i mod keyLen}) mod 26   （解密，sign = -1）
 *
 * 密钥字母只对**字母字符**生效；非字母字符原样保留且**不消耗**密钥位。
 * 解密 = 用负位移加密（sign = -1）。
 *
 * @param text 输入文本
 * @param key 密钥（任意大小写、可含非字母；会被规范化为大写字母串）
 * @param decrypt 是否解密（默认 false = 加密）
 * @param hooks 可选的事件钩子
 */
export function vigenere(
  text: string,
  key: string,
  decrypt = false,
  hooks: VigenereHooks = {},
): VigenereResult {
  const normKey = normalizeKey(key);
  const sign = decrypt ? -1 : 1;
  const chars: string[] = [];
  let keyPos = 0; // 已消耗的密钥字母数

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    const keyChar = normKey[keyPos % normKey.length]!;
    const keyShift = mod26(sign * (keyChar.charCodeAt(0) - A_UPPER));
    hooks.onChar?.(i, ch, keyChar, keyShift);

    if (code >= A_UPPER && code < A_UPPER + ALPHA_LEN) {
      const shifted = String.fromCharCode(A_UPPER + mod26(code - A_UPPER + keyShift));
      chars.push(shifted);
      hooks.onShift?.(i, ch, shifted, keyChar);
      keyPos++;
    } else if (code >= A_LOWER && code < A_LOWER + ALPHA_LEN) {
      // 小写：结果保持小写
      const shifted = String.fromCharCode(A_LOWER + mod26(code - A_LOWER + keyShift));
      chars.push(shifted);
      hooks.onShift?.(i, ch, shifted, keyChar);
      keyPos++;
    } else {
      // 非字母：原样保留，不消耗密钥
      chars.push(ch);
      hooks.onSkip?.(i, ch);
    }
  }

  return { text: chars.join(''), chars };
}

/** 维吉尼亚解密 = 用 sign = -1 加密。 */
export function vigenereDecipher(
  text: string,
  key: string,
  hooks: VigenereHooks = {},
): VigenereResult {
  return vigenere(text, key, true, hooks);
}
