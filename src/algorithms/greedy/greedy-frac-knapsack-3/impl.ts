// 分数背包 · 实现
export interface Item {
  w: number;
  v: number;
}
export interface FracKnapsackHooks {
  onPick?: (idx: number, fraction: number, gained: number) => void;
  onConclude?: (totalValue: number) => void;
}
export interface FracKnapsackResult {
  totalValue: number;
  fractions: number[];
}
export function greedyFracKnapsack3(
  capacity: number,
  items: ReadonlyArray<Item>,
  hooks: FracKnapsackHooks = {},
): FracKnapsackResult {
  const order = items.map((it, i) => ({ i, ratio: it.v / it.w })).sort((a, b) => b.ratio - a.ratio);
  let cap = capacity;
  let totalValue = 0;
  const fractions = new Array(items.length).fill(0);
  for (const { i } of order) {
    if (cap <= 0) break;
    const take = Math.min(items[i]!.w, cap);
    const frac = take / items[i]!.w;
    fractions[i] = frac;
    const gained = frac * items[i]!.v;
    totalValue += gained;
    cap -= take;
    hooks.onPick?.(i, frac, gained);
  }
  hooks.onConclude?.(totalValue);
  return { totalValue, fractions };
}
