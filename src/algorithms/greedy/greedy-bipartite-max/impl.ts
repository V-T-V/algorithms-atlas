// 贪心二分匹配 · 实现
export interface GbmHooks {
  onEdge?: (u: number, v: number, taken: boolean) => void;
  onConclude?: (size: number) => void;
}
export function greedyBipartiteMatch(
  edges: ReadonlyArray<readonly [number, number]>,
  hooks: GbmHooks = {},
): number {
  const matchedL = new Set<number>(),
    matchedR = new Set<number>();
  let size = 0;
  for (const [u, v] of edges) {
    if (!matchedL.has(u) && !matchedR.has(v)) {
      matchedL.add(u);
      matchedR.add(v);
      size++;
      hooks.onEdge?.(u, v, true);
    } else hooks.onEdge?.(u, v, false);
  }
  hooks.onConclude?.(size);
  return size;
}
