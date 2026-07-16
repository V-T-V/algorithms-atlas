// Möbius 函数 · 实现
export interface MbHooks {
  onFactor?: (p: number) => void;
  onConclude?: (mu: number) => void;
}
export function mobius(n: number, hooks: MbHooks = {}): number {
  if (n === 1) {
    hooks.onConclude?.(1);
    return 1;
  }
  let m = n,
    cnt = 0;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      cnt++;
      hooks.onFactor?.(p);
      m = Math.floor(m / p);
      if (m % p === 0) {
        hooks.onConclude?.(0);
        return 0;
      }
    }
  }
  if (m > 1) {
    cnt++;
    hooks.onFactor?.(m);
  }
  const mu = cnt % 2 === 0 ? 1 : -1;
  hooks.onConclude?.(mu);
  return mu;
}
