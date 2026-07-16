export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}
export function buildAdj(g: GraphInput): Map<string, Array<{ to: string; w: number }>> {
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push({ to: e.to, w: e.weight });
    if (!g.directed) adj.get(e.to)!.push({ to: e.from, w: e.weight });
  }
  return adj;
}
export interface DijkstraHooks {
  onRelax?: (u: string, v: string, nd: number) => void;
  onResult?: (dist: Map<string, number>) => void;
}
export function dijkstra(
  g: GraphInput,
  src: string,
  hooks: DijkstraHooks = {},
): Map<string, number> {
  const adj = buildAdj(g);
  const dist = new Map<string, number>();
  for (const n of g.nodes) dist.set(n, Infinity);
  dist.set(src, 0);
  const visited = new Set<string>();
  while (visited.size < g.nodes.length) {
    let u: string | null = null,
      best = Infinity;
    for (const [n, d] of dist)
      if (!visited.has(n) && d < best) {
        best = d;
        u = n;
      }
    if (u === null) break;
    visited.add(u);
    for (const { to, w } of adj.get(u) ?? []) {
      const nd = dist.get(u)! + w;
      if (nd < dist.get(to)!) {
        dist.set(to, nd);
        hooks.onRelax?.(u, to, nd);
      }
    }
  }
  hooks.onResult?.(dist);
  return dist;
}
