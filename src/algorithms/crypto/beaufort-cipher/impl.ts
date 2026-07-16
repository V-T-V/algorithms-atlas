// =============================================================================
// Beaufort 密码 · 纯算法实现
// =============================================================================

const ALPHA_LEN = 26;
const A_UPPER = 65;
const A_LOWER = 97;

function mod26(n: number): number {
  return ((n % ALPHA_LEN) + ALPHA_LEN) % ALPHA_LEN;
}

export interface BeaufortHooks {
  onChar?: (i: number, plain: string, keyChar: string) => void;
  onMap?: (i: number, plain: string, keyChar: string, cipher: string) => void;
  onSkip?: (i: number, ch: string) => void;
}

export interface BeaufortResult {
  text: string;
  chars: string[];
}

/** 把密钥规范化为大写字母串，空视为 'A'。 */
export function normalizeKey(key: string): string {
  const cleaned = key.toUpperCase().replace(/[^A-Z]/g, '');
  return cleaned.length === 0 ? 'A' : cleaned;
}

/**
 * Beaufort 加密：C_i = (K_i - P_i) mod 26。
 * 由于自反，加密与解密是同一函数。
 * 非字母保留且不消耗密钥。
 */
export function beaufort(text: string, key: string, hooks: BeaufortHooks = {}): BeaufortResult {
  const normKey = normalizeKey(key);
  const chars: string[] = [];
  let keyPos = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    const keyChar = normKey[keyPos % normKey.length]!;
    const kShift = keyChar.charCodeAt(0) - A_UPPER;
    hooks.onChar?.(i, ch, keyChar);

    if (code >= A_UPPER && code < A_UPPER + ALPHA_LEN) {
      const p = code - A_UPPER;
      const c = mod26(kShift - p);
      const out = String.fromCharCode(A_UPPER + c);
      chars.push(out);
      hooks.onMap?.(i, ch, keyChar, out);
      keyPos++;
    } else if (code >= A_LOWER && code < A_LOWER + ALPHA_LEN) {
      // 小写：先转大写计算，输出保持小写
      const p = code - A_LOWER;
      const c = mod26(kShift - p);
      const out = String.fromCharCode(A_LOWER + c);
      chars.push(out);
      hooks.onMap?.(i, ch, keyChar, out);
      keyPos++;
    } else {
      chars.push(ch);
      hooks.onSkip?.(i, ch);
    }
  }
  return { text: chars.join(''), chars };
}
