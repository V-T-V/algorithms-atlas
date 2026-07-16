export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string; weight: number }>;
}
export interface PrimHooks {
  onAdd?: (v: string, w: number) => void;
  onResult?: (total: number) => void;
}
export function primMST(g: GraphInput, hooks: PrimHooks = {}): number {
  const n = g.nodes.length;
  const idx = new Map(g.nodes.map((x, i) => [x, i] as const));
  const adj: Array<Array<{ to: number; w: number }>> = Array.from({ length: n }, () => []);
  for (const e of g.edges) {
    const i = idx.get(e.from)!,
      j = idx.get(e.to)!;
    adj[i]!.push({ to: j, w: e.weight });
    adj[j]!.push({ to: i, w: e.weight });
  }
  const inTree = new Array<boolean>(n).fill(false);
  const minEdge = new Array<number>(n).fill(Infinity);
  minEdge[0] = 0;
  let total = 0;
  for (let it = 0; it < n; it++) {
    let u = -1,
      best = Infinity;
    for (let v = 0; v < n; v++)
      if (!inTree[v] && minEdge[v]! < best) {
        best = minEdge[v]!;
        u = v;
      }
    if (u < 0) break;
    inTree[u] = true;
    total += minEdge[u]!;
    hooks.onAdd?.(g.nodes[u]!, minEdge[u]!);
    for (const { to, w } of adj[u]!) if (!inTree[to] && w < minEdge[to]!) minEdge[to] = w;
  }
  hooks.onResult?.(total);
  return total;
}
