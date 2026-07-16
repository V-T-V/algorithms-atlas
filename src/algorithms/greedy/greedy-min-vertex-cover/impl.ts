// 贪心点覆盖 · 实现
export interface VcHooks {
  onPick?: (v: number, degree: number) => void;
  onConclude?: (cover: number[]) => void;
}
export function greedyVertexCover(
  n: number,
  edges: ReadonlyArray<readonly [number, number]>,
  hooks: VcHooks = {},
): number[] {
  const adj = Array.from({ length: n }, () => new Set<number>());
  for (const [u, v] of edges) {
    adj[u]!.add(v);
    adj[v]!.add(u);
  }
  const cover: number[] = [];
  let remaining = edges.length;
  while (remaining > 0) {
    let best = -1,
      bestDeg = 0;
    for (let i = 0; i < n; i++)
      if (adj[i]!.size > bestDeg) {
        bestDeg = adj[i]!.size;
        best = i;
      }
    if (best < 0) break;
    cover.push(best);
    hooks.onPick?.(best, bestDeg);
    remaining -= adj[best]!.size;
    for (const nb of adj[best]!) {
      adj[nb]!.delete(best);
      remaining = remaining;
    }
    adj[best]!.clear();
    remaining = 0;
    for (let i = 0; i < n; i++) remaining += adj[i]!.size;
    remaining = Math.floor(remaining / 1);
  }
  // 重新精确计算 remaining
  hooks.onConclude?.(cover);
  return cover;
}
