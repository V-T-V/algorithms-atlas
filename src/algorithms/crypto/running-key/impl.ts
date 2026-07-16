// =============================================================================
// 运行密钥密码 · 纯算法实现
// 与维吉尼亚同构，但密钥不循环（密钥长度需 >= 明文长度）。
// =============================================================================

const ALPHA_LEN = 26;
const A_UPPER = 65;
const A_LOWER = 97;

function mod26(n: number): number {
  return ((n % ALPHA_LEN) + ALPHA_LEN) % ALPHA_LEN;
}

export interface RunningKeyHooks {
  onChar?: (i: number, plain: string, keyChar: string, keyShift: number) => void;
  onMap?: (i: number, plain: string, keyChar: string, cipher: string) => void;
  onSkip?: (i: number, ch: string) => void;
}

export interface RunningKeyResult {
  text: string;
  chars: string[];
}

/** 规范化运行密钥：大写、去非字母。 */
export function normalizeKey(key: string): string {
  return key.toUpperCase().replace(/[^A-Z]/g, '');
}

/**
 * 运行密钥密码（维吉尼亚变体）：C_i = (P_i + K_i) mod 26。
 * 与维吉尼亚不同：密钥不循环，要求 key 的字母数 >= 明文的字母数。
 * 解密用 sign = -1。
 */
export function runningKey(
  text: string,
  key: string,
  decrypt = false,
  hooks: RunningKeyHooks = {},
): RunningKeyResult {
  const normKey = normalizeKey(key);
  const sign = decrypt ? -1 : 1;
  const chars: string[] = [];
  let keyPos = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    if (
      (code >= A_UPPER && code < A_UPPER + ALPHA_LEN) ||
      (code >= A_LOWER && code < A_LOWER + ALPHA_LEN)
    ) {
      if (keyPos >= normKey.length) {
        throw new Error('运行密钥长度不足：密钥字母数少于明文字母数');
      }
      const keyChar = normKey[keyPos]!;
      const kShift = mod26(sign * (keyChar.charCodeAt(0) - A_UPPER));
      hooks.onChar?.(i, ch, keyChar, kShift);
      if (code >= A_UPPER && code < A_UPPER + ALPHA_LEN) {
        const out = String.fromCharCode(A_UPPER + mod26(code - A_UPPER + kShift));
        chars.push(out);
        hooks.onMap?.(i, ch, keyChar, out);
      } else {
        const out = String.fromCharCode(A_LOWER + mod26(code - A_LOWER + kShift));
        chars.push(out);
        hooks.onMap?.(i, ch, keyChar, out);
      }
      keyPos++;
    } else {
      chars.push(ch);
      hooks.onSkip?.(i, ch);
    }
  }
  return { text: chars.join(''), chars };
}

/** 解密 = sign = -1 的同函数。 */
export function runningKeyDecipher(
  text: string,
  key: string,
  hooks: RunningKeyHooks = {},
): RunningKeyResult {
  return runningKey(text, key, true, hooks);
}
