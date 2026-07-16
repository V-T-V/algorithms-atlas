// 最后一个单词长度 · 实现
export interface LastWordHooks {
  onConclude?: (length: number) => void;
}
export function miscLengthLastWord2(s: string, hooks: LastWordHooks = {}): number {
  let i = s.length - 1;
  while (i >= 0 && s[i] === ' ') i--;
  let len = 0;
  while (i >= 0 && s[i] !== ' ') {
    len++;
    i--;
  }
  hooks.onConclude?.(len);
  return len;
}
