// =============================================================================
// 凯撒密码 Caesar Cipher · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 26 个英文字母（大写）。 */
const ALPHA_LEN = 26;
const A_UPPER = 65; // 'A'.charCodeAt(0)
const A_LOWER = 97; // 'a'.charCodeAt(0)

/** 把一个整数规范化到 [0, 25] 区间（处理负位移）。 */
function mod26(n: number): number {
  return ((n % ALPHA_LEN) + ALPHA_LEN) % ALPHA_LEN;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CaesarCipherHooks {
  /** 开始处理第 i 个字符（原始字符 original）。 */
  onChar?: (i: number, original: string) => void;
  /** 对字符 ch 应用位移 shift，得到结果 shifted。 */
  onShift?: (i: number, original: string, shifted: string) => void;
  /** 跳过非字母字符。 */
  onSkip?: (i: number, ch: string) => void;
}

export interface CaesarCipherResult {
  /** 加密/解密后的文本。 */
  text: string;
  /** 逐字符结果（与输入等长，非字母原样保留）。 */
  chars: string[];
}

/**
 * 凯撒密码：把每个字母沿字母表平移 shift 位。
 * 非字母字符原样保留。shift 可为负（解密 = 加密 -shift）。
 *
 * @param text 输入文本
 * @param shift 位移量（正=后移，负=前移），会被 mod 26 规范化
 * @param hooks 可选的事件钩子
 */
export function caesarCipher(
  text: string,
  shift: number,
  hooks: CaesarCipherHooks = {},
): CaesarCipherResult {
  const s = mod26(shift);
  const chars: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    hooks.onChar?.(i, ch);

    let shifted: string;
    if (code >= A_UPPER && code < A_UPPER + ALPHA_LEN) {
      shifted = String.fromCharCode(A_UPPER + mod26(code - A_UPPER + s));
      chars.push(shifted);
      hooks.onShift?.(i, ch, shifted);
    } else if (code >= A_LOWER && code < A_LOWER + ALPHA_LEN) {
      shifted = String.fromCharCode(A_LOWER + mod26(code - A_LOWER + s));
      chars.push(shifted);
      hooks.onShift?.(i, ch, shifted);
    } else {
      // 非字母：原样保留
      chars.push(ch);
      hooks.onSkip?.(i, ch);
    }
  }

  return { text: chars.join(''), chars };
}

/** 凯撒解密 = 加密相反位移。 */
export function caesarDecipher(
  text: string,
  shift: number,
  hooks: CaesarCipherHooks = {},
): CaesarCipherResult {
  return caesarCipher(text, -shift, hooks);
}
