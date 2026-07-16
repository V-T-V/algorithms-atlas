// 亏数判定 · 实现
export interface DnHooks {
  onConclude?: (sum: number, isDeficient: boolean) => void;
}
export function isDeficient(n: number, hooks: DnHooks = {}): boolean {
  if (n < 2) {
    hooks.onConclude?.(0, true);
    return true;
  }
  let s = 1;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      s += i;
      if (i !== n / i) s += n / i;
    }
  }
  const d = s < n;
  hooks.onConclude?.(s, d);
  return d;
}
