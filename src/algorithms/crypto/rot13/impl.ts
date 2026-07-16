// =============================================================================
// ROT13 · 纯算法实现
// =============================================================================

const ALPHA_LEN = 26;
const A_UPPER = 65;
const A_LOWER = 97;

function mod26(n: number): number {
  return ((n % ALPHA_LEN) + ALPHA_LEN) % ALPHA_LEN;
}

export interface Rot13Hooks {
  onChar?: (i: number, original: string) => void;
  onShift?: (i: number, original: string, shifted: string) => void;
  onSkip?: (i: number, ch: string) => void;
}

export interface Rot13Result {
  text: string;
  chars: string[];
}

/**
 * ROT13：每个字母平移 13 位，非字母保留。
 * 由于 13 = 26/2，rot13 是自对合的：再跑一次即还原。
 */
export function rot13(text: string, hooks: Rot13Hooks = {}): Rot13Result {
  const chars: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    hooks.onChar?.(i, ch);
    let shifted: string;
    if (code >= A_UPPER && code < A_UPPER + ALPHA_LEN) {
      shifted = String.fromCharCode(A_UPPER + mod26(code - A_UPPER + 13));
      chars.push(shifted);
      hooks.onShift?.(i, ch, shifted);
    } else if (code >= A_LOWER && code < A_LOWER + ALPHA_LEN) {
      shifted = String.fromCharCode(A_LOWER + mod26(code - A_LOWER + 13));
      chars.push(shifted);
      hooks.onShift?.(i, ch, shifted);
    } else {
      chars.push(ch);
      hooks.onSkip?.(i, ch);
    }
  }
  return { text: chars.join(''), chars };
}
