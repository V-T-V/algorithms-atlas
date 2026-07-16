// atoi · 实现
const INT_MIN = -2147483648;
const INT_MAX = 2147483647;
export interface AtoiHooks {
  onDigit?: (i: number, digit: number, acc: number) => void;
  onConclude?: (result: number) => void;
}
export function miscStringAtoi(s: string, hooks: AtoiHooks = {}): number {
  let i = 0;
  while (i < s.length && s[i] === ' ') i++;
  let sign = 1;
  if (i < s.length && (s[i] === '+' || s[i] === '-')) {
    sign = s[i] === '-' ? -1 : 1;
    i++;
  }
  let acc = 0;
  while (i < s.length && s[i]! >= '0' && s[i]! <= '9') {
    const d = Number(s[i]!);
    acc = acc * 10 + d;
    hooks.onDigit?.(i, d, acc);
    if (sign * acc > INT_MAX) {
      hooks.onConclude?.(INT_MAX);
      return INT_MAX;
    }
    if (sign * acc < INT_MIN) {
      hooks.onConclude?.(INT_MIN);
      return INT_MIN;
    }
    i++;
  }
  const result = sign * acc;
  hooks.onConclude?.(result);
  return result;
}
