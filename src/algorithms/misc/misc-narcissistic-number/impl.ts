// 水仙花数 · 实现
export interface NaHooks {
  onConclude?: (sum: number, isNarcissistic: boolean) => void;
}
export function isNarcissistic(n: number, hooks: NaHooks = {}): boolean {
  const digits: number[] = [];
  let m = n;
  while (m > 0) {
    digits.push(m % 10);
    m = Math.floor(m / 10);
  }
  const k = digits.length;
  const sum = digits.reduce((a, d) => a + Math.pow(d, k), 0);
  const ok = sum === n;
  hooks.onConclude?.(sum, ok);
  return ok;
}
