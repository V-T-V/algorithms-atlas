export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string; weight?: number }>;
}
export interface LpHooks {
  onRelax?: (u: string, v: string, d: number) => void;
  onResult?: (max: number) => void;
}
export function longestPathDAG(g: GraphInput, hooks: LpHooks = {}): number {
  const idx = new Map(g.nodes.map((n, i) => [n, i] as const));
  const n = g.nodes.length;
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const e of g.edges) {
    const i = idx.get(e.from)!,
      j = idx.get(e.to)!;
    adj[i]!.push([j, e.weight ?? 1]);
    indeg[j]!++;
  }
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const dist = new Array(n).fill(0);
  let max = 0;
  while (q.length) {
    const u = q.shift()!;
    for (const [v, w] of adj[u]!) {
      if (dist[u]! + w > dist[v]!) {
        dist[v] = dist[u]! + w;
        hooks.onRelax?.(g.nodes[u]!, g.nodes[v]!, dist[v]!);
        max = Math.max(max, dist[v]!);
      }
      indeg[v]!--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  hooks.onResult?.(max);
  return max;
}
