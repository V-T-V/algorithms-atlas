// 分发糖果 · 实现
export interface CandyHooks {
  onInit?: (n: number) => void;
  onLeftSweep?: (i: number, candies: number[]) => void;
  onRightSweep?: (i: number, candies: number[]) => void;
  onConclude?: (total: number, candies: number[]) => void;
}
export interface CandyResult {
  total: number;
  candies: number[];
}
export function greedyCandy2(ratings: readonly number[], hooks: CandyHooks = {}): CandyResult {
  const n = ratings.length;
  const c = new Array(n).fill(1);
  hooks.onInit?.(n);
  for (let i = 1; i < n; i++) {
    if (ratings[i]! > ratings[i - 1]!) c[i] = c[i - 1]! + 1;
    hooks.onLeftSweep?.(i, [...c]);
  }
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i]! > ratings[i + 1]!) c[i] = Math.max(c[i]!, c[i + 1]! + 1);
    hooks.onRightSweep?.(i, [...c]);
  }
  const total = c.reduce((s, x) => s + x, 0);
  hooks.onConclude?.(total, c);
  return { total, candies: c };
}
