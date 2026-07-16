// 多项式滚动哈希 (双模) · 实现
export interface PrHooks {
  onChar?: (i: number, ch: number, h1: number, h2: number) => void;
  onConclude?: (hash: [number, number]) => void;
}
export function polynomialRollHash(s: string, hooks: PrHooks = {}): [number, number] {
  const A = 31,
    P1 = 1000000007,
    P2 = 1000000009;
  let h1 = 0,
    h2 = 0;
  for (let i = 0; i < s.length; i++) {
    h1 = (h1 * A + s.charCodeAt(i)) % P1;
    h2 = (h2 * A + s.charCodeAt(i)) % P2;
    hooks.onChar?.(i, s.charCodeAt(i), h1, h2);
  }
  hooks.onConclude?.([h1, h2]);
  return [h1, h2];
}
