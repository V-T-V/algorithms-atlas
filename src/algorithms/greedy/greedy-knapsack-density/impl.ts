// 0/1 背包密度贪心 · 实现
export interface KdItem {
  w: number;
  v: number;
}
export interface KdHooks {
  onConsider?: (i: number, density: number, taken: boolean) => void;
  onConclude?: (totalValue: number, totalWeight: number) => void;
}
export function knapsackDensityGreedy(
  capacity: number,
  items: readonly KdItem[],
  hooks: KdHooks = {},
): { value: number; weight: number } {
  const order = items.map((it, i) => ({ i, d: it.v / it.w, it })).sort((a, b) => b.d - a.d);
  let value = 0,
    weight = 0;
  for (const { i, d, it } of order) {
    const taken = weight + it.w <= capacity;
    if (taken) {
      value += it.v;
      weight += it.w;
    }
    hooks.onConsider?.(i, d, taken);
  }
  hooks.onConclude?.(value, weight);
  return { value, weight };
}
