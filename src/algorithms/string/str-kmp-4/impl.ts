// =============================================================================
// KMP（前缀函数版）
// =============================================================================

export interface Kmp4Hooks {
  onPi?: (i: number, value: number) => void;
  onCompare?: (i: number, j: number, equal: boolean) => void;
  onJump?: (i: number, from: number, to: number) => void;
  onFound?: (start: number) => void;
}

export function prefixFunction(s: string, hooks: Kmp4Hooks = {}): number[] {
  const n = s.length;
  const pi = new Array<number>(n).fill(0);
  for (let i = 1; i < n; i++) {
    let j = pi[i - 1]!;
    while (j > 0 && s[i] !== s[j]) j = pi[j - 1]!;
    if (s[i] === s[j]) j++;
    pi[i] = j;
    hooks.onPi?.(i, j);
  }
  return pi;
}

export function kmp4(text: string, pat: string, hooks: Kmp4Hooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];
  const pi = prefixFunction(pat, hooks);
  const result: number[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    while (j > 0 && text[i] !== pat[j]) {
      const from = j;
      j = pi[j - 1]!;
      hooks.onJump?.(i, from, j);
    }
    const equal = text[i] === pat[j];
    hooks.onCompare?.(i, j, equal);
    if (equal) j++;
    if (j === m) {
      const start = i - m + 1;
      hooks.onFound?.(start);
      result.push(start);
      j = pi[j - 1]!;
    }
  }
  return result;
}
