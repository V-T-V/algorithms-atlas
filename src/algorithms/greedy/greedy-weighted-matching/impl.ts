// 贪心最大权匹配 · 实现
export interface WEdge {
  u: number;
  v: number;
  w: number;
}
export interface GwmHooks {
  onPick?: (u: number, v: number, w: number) => void;
  onConclude?: (totalWeight: number, count: number) => void;
}
export function greedyWeightedMatching(
  edges: ReadonlyArray<WEdge>,
  hooks: GwmHooks = {},
): { total: number; count: number } {
  const order = [...edges].sort((a, b) => b.w - a.w);
  const matched = new Set<number>();
  let total = 0,
    count = 0;
  for (const e of order) {
    if (!matched.has(e.u) && !matched.has(e.v)) {
      matched.add(e.u);
      matched.add(e.v);
      total += e.w;
      count++;
      hooks.onPick?.(e.u, e.v, e.w);
    }
  }
  hooks.onConclude?.(total, count);
  return { total, count };
}
