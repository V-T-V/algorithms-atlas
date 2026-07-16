// Dijkstra · 实现（非负权，O(V²)）
export interface DijkstraHooks {
  onSettle?: (u: number, dist: number) => void;
  onRelax?: (u: number, v: number, newDist: number) => void;
  onConclude?: (dist: number[]) => void;
}
export interface DijkstraResult {
  dist: number[];
}
export function greedyDijkstra3(
  graph: ReadonlyArray<readonly number[]>,
  src = 0,
  hooks: DijkstraHooks = {},
): DijkstraResult {
  const n = graph.length;
  const dist = new Array(n).fill(Infinity);
  const settled = new Array(n).fill(false);
  dist[src] = 0;
  for (let i = 0; i < n; i++) {
    let u = -1;
    for (let v = 0; v < n; v++) if (!settled[v] && (u === -1 || dist[v]! < dist[u]!)) u = v;
    if (u === -1 || dist[u] === Infinity) break;
    settled[u] = true;
    hooks.onSettle?.(u, dist[u]!);
    for (let v = 0; v < n; v++) {
      const w = graph[u]![v]!;
      if (w > 0 && !settled[v] && dist[u]! + w < dist[v]!) {
        dist[v] = dist[u]! + w;
        hooks.onRelax?.(u, v, dist[v]!);
      }
    }
  }
  hooks.onConclude?.(dist);
  return { dist };
}
