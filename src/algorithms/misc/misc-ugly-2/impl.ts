// 丑数 · 实现
export interface UglyHooks {
  onDivide?: (factor: number, cur: number) => void;
  onConclude?: (ugly: boolean) => void;
}
export function miscUgly2(n: number, hooks: UglyHooks = {}): boolean {
  if (n <= 0) return false;
  let cur = n;
  for (const f of [2, 3, 5]) {
    while (cur % f === 0) {
      cur /= f;
      hooks.onDivide?.(f, cur);
    }
  }
  const ugly = cur === 1;
  hooks.onConclude?.(ugly);
  return ugly;
}
