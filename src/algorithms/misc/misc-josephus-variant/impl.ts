// 约瑟夫变体 · 实现
export interface JvHooks {
  onRound?: (alive: number, survivor: number) => void;
  onConclude?: (survivor: number) => void;
}
export function josephusVariant(n: number, k: number, hooks: JvHooks = {}): number {
  let s = 0;
  for (let i = 2; i <= n; i++) {
    s = (s + k) % i;
    hooks.onRound?.(i, s);
  }
  hooks.onConclude?.(s);
  return s;
}
