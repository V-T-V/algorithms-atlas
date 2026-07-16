// 赌徒破产 · 实现
export interface RuinHooks {
  onCapital?: (i: number, pRuin: number) => void;
  onConclude?: (pRuin: number) => void;
}
export function gamblerRuin(i: number, n: number, p: number, hooks: RuinHooks = {}): number {
  let pr: number;
  if (Math.abs(p - 0.5) < 1e-9) pr = (n - i) / n;
  else {
    const r = (1 - p) / p;
    pr = (Math.pow(r, n) - Math.pow(r, i)) / (Math.pow(r, n) - 1);
  }
  hooks.onCapital?.(i, pr);
  hooks.onConclude?.(pr);
  return pr;
}
