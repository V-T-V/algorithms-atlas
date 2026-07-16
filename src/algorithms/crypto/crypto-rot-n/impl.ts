// =============================================================================
// ROT-N 旋转密码 · 纯算法实现
// =============================================================================
const ALPHA_LEN = 26;
const A_UPPER = 65;
const A_LOWER = 97;

function mod26(n: number): number {
  return ((n % ALPHA_LEN) + ALPHA_LEN) % ALPHA_LEN;
}

export interface RotNHooks {
  onChar?: (i: number, original: string, shifted: string) => void;
}

export function rotN(text: string, n: number, hooks: RotNHooks = {}): string {
  const s = mod26(n);
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    let shifted = ch;
    if (code >= A_UPPER && code < A_UPPER + ALPHA_LEN) {
      shifted = String.fromCharCode(A_UPPER + mod26(code - A_UPPER + s));
    } else if (code >= A_LOWER && code < A_LOWER + ALPHA_LEN) {
      shifted = String.fromCharCode(A_LOWER + mod26(code - A_LOWER + s));
    }
    out += shifted;
    hooks.onChar?.(i, ch, shifted);
  }
  return out;
}
