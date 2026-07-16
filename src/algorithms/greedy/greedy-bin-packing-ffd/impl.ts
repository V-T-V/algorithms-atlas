// 首次适应递减装箱 · 实现
export interface FfdHooks {
  onPlace?: (item: number, bin: number, binLoad: number) => void;
  onConclude?: (binCount: number) => void;
}
export function firstFitDecreasing(
  items: readonly number[],
  capacity: number,
  hooks: FfdHooks = {},
): number {
  const order = [...items].map((v, i) => ({ i, v })).sort((a, b) => b.v - a.v);
  const bins: number[] = [];
  for (const { i, v } of order) {
    let placed = -1;
    for (let b = 0; b < bins.length; b++)
      if (bins[b]! + v <= capacity) {
        bins[b]! += v;
        placed = b;
        break;
      }
    if (placed < 0) {
      bins.push(v);
      placed = bins.length - 1;
    }
    hooks.onPlace?.(i, placed, bins[placed]!);
  }
  hooks.onConclude?.(bins.length);
  return bins.length;
}
