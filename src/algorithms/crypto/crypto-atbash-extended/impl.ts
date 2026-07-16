// =============================================================================
// 扩展埃特巴什密码 · 纯算法实现
// 字母 A↔Z；数字 0↔9；其它保留。自反。
// =============================================================================
const A_UPPER = 65;
const A_LOWER = 97;
const D_ZERO = 48;

export interface AtbashExtHooks {
  onChar?: (i: number, original: string, mapped: string) => void;
}

export function atbashExtended(text: string, hooks: AtbashExtHooks = {}): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const code = ch.charCodeAt(0);
    let mapped = ch;
    if (code >= A_UPPER && code < A_UPPER + 26) {
      mapped = String.fromCharCode(A_UPPER + 25 - (code - A_UPPER));
    } else if (code >= A_LOWER && code < A_LOWER + 26) {
      mapped = String.fromCharCode(A_LOWER + 25 - (code - A_LOWER));
    } else if (code >= D_ZERO && code < D_ZERO + 10) {
      mapped = String.fromCharCode(D_ZERO + 9 - (code - D_ZERO));
    }
    out += mapped;
    hooks.onChar?.(i, ch, mapped);
  }
  return out;
}
