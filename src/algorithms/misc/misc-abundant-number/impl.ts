// 过剩数判定 · 实现
export interface AnHooks {
  onDivisor?: (d: number) => void;
  onConclude?: (sum: number, isAbundant: boolean) => void;
}
export function isAbundant(n: number, hooks: AnHooks = {}): boolean {
  if (n < 12) {
    hooks.onConclude?.(0, false);
    return false;
  }
  let s = 1;
  hooks.onDivisor?.(1);
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      s += i;
      hooks.onDivisor?.(i);
      if (i !== n / i) {
        s += n / i;
        hooks.onDivisor?.(n / i);
      }
    }
  }
  const ab = s > n;
  hooks.onConclude?.(s, ab);
  return ab;
}
