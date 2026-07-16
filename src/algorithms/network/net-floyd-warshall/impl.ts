export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}
export interface FwHooks {
  onK?: (k: string) => void;
  onResult?: (dist: number[][]) => void;
}
export function floydWarshall(g: GraphInput, hooks: FwHooks = {}): number[][] {
  const n = g.nodes.length;
  const idx = new Map(g.nodes.map((x, i) => [x, i] as const));
  const INF = 1 << 29;
  const dist: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : INF)),
  );
  for (const e of g.edges) {
    const i = idx.get(e.from)!,
      j = idx.get(e.to)!;
    dist[i]![j] = Math.min(dist[i]![j]!, e.weight);
    if (!g.directed) dist[j]![i] = Math.min(dist[j]![i]!, e.weight);
  }
  for (let k = 0; k < n; k++) {
    hooks.onK?.(g.nodes[k]!);
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        if (dist[i]![k]! + dist[k]![j]! < dist[i]![j]!) dist[i]![j] = dist[i]![k]! + dist[k]![j]!;
      }
  }
  hooks.onResult?.(dist);
  return dist;
}
