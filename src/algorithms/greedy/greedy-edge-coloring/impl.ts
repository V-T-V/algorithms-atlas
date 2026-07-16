// 贪心边着色 · 实现
export interface EcHooks {
  onColor?: (u: number, v: number, color: number) => void;
  onConclude?: (colors: number) => void;
}
export function greedyEdgeColoring(
  edges: ReadonlyArray<readonly [number, number]>,
  hooks: EcHooks = {},
): number {
  const used = new Map<string, Set<number>>();
  const getColor = (v: number) => used.get('v' + v) ?? new Set<number>();
  let maxColor = 0;
  for (const [u, v] of edges) {
    const usedU = getColor(u),
      usedV = getColor(v);
    let c = 1;
    while (usedU.has(c) || usedV.has(c)) c++;
    if (!used.has('v' + u)) used.set('v' + u, new Set());
    if (!used.has('v' + v)) used.set('v' + v, new Set());
    used.get('v' + u)!.add(c);
    used.get('v' + v)!.add(c);
    maxColor = Math.max(maxColor, c);
    hooks.onColor?.(u, v, c);
  }
  hooks.onConclude?.(maxColor);
  return maxColor;
}
