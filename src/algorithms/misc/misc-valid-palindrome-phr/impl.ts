// 验证回文短语 · 实现
export interface PalindromeHooks {
  onCompare?: (i: number, j: number, equal: boolean) => void;
  onConclude?: (isPalindrome: boolean) => void;
}
export function miscValidPalindromePhr(s: string, hooks: PalindromeHooks = {}): boolean {
  let i = 0;
  let j = s.length - 1;
  const isAlnum = (c: string) => /[a-z0-9]/i.test(c);
  while (i < j) {
    while (i < j && !isAlnum(s[i]!)) i++;
    while (i < j && !isAlnum(s[j]!)) j--;
    if (s[i]!.toLowerCase() !== s[j]!.toLowerCase()) {
      hooks.onCompare?.(i, j, false);
      hooks.onConclude?.(false);
      return false;
    }
    hooks.onCompare?.(i, j, true);
    i++;
    j--;
  }
  hooks.onConclude?.(true);
  return true;
}
