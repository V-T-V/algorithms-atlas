// 伯特兰寡头 · 实现
export interface BertrandHooks {
  onPrices?: (p1: number, p2: number, profit1: number, profit2: number) => void;
  onEquilibrium?: (price: number) => void;
}
export function bertrandDuopoly(
  a: number,
  c: number,
  hooks: BertrandHooks = {},
): { p1: number; p2: number; profit: number } {
  // 需求 D(p)=a-p. 均衡 p=c
  const p1 = c,
    p2 = c;
  const profit = ((p1 - c) * Math.max(0, a - p1)) / 2; // 平分
  hooks.onPrices?.(p1, p2, profit, profit);
  hooks.onEquilibrium?.(p1);
  return { p1, p2, profit };
}
