// =============================================================================
// Atbash · 纯算法实现
// =============================================================================

const ALPHA_LEN = 26;
const A_UPPER = 65;
const A_LOWER = 97;

export interface AtbashHooks {
  onChar?: (i: number, original: string) => void;
  onMap?: (i: number, original: string, mapped: string) => void;
  onSkip?: (i: number, ch: string) => void;
}

export interface AtbashResult {
  text: string;
  chars: string[];
}

/** Atbash：c → (25 - (c-A)) + A，自对合。 */
export function atbash(text: string, hooks: AtbashHooks = {}): AtbashResult {
  const chars: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    hooks.onChar?.(i, ch);
    let mapped: string;
    if (code >= A_UPPER && code < A_UPPER + ALPHA_LEN) {
      mapped = String.fromCharCode(A_UPPER + (ALPHA_LEN - 1 - (code - A_UPPER)));
      chars.push(mapped);
      hooks.onMap?.(i, ch, mapped);
    } else if (code >= A_LOWER && code < A_LOWER + ALPHA_LEN) {
      mapped = String.fromCharCode(A_LOWER + (ALPHA_LEN - 1 - (code - A_LOWER)));
      chars.push(mapped);
      hooks.onMap?.(i, ch, mapped);
    } else {
      chars.push(ch);
      hooks.onSkip?.(i, ch);
    }
  }
  return { text: chars.join(''), chars };
}
