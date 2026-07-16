// Prim MST · 实现（邻接矩阵，O(V²)）
export interface PrimHooks {
  onPick?: (u: number, v: number, w: number) => void;
  onConclude?: (totalWeight: number) => void;
}
export interface PrimResult {
  totalWeight: number;
}
export function greedyPrim3(
  graph: ReadonlyArray<readonly number[]>,
  start = 0,
  hooks: PrimHooks = {},
): PrimResult {
  const n = graph.length;
  const inTree = new Array(n).fill(false);
  const minEdge = new Array(n).fill(Infinity);
  const from = new Array(n).fill(-1);
  minEdge[start] = 0;
  let totalWeight = 0;
  for (let i = 0; i < n; i++) {
    let u = -1;
    for (let v = 0; v < n; v++) if (!inTree[v] && (u === -1 || minEdge[v]! < minEdge[u]!)) u = v;
    if (u === -1 || minEdge[u] === Infinity) break;
    inTree[u] = true;
    totalWeight += minEdge[u]!;
    if (from[u] !== -1) hooks.onPick?.(from[u]!, u, minEdge[u]!);
    for (let v = 0; v < n; v++) {
      if (!inTree[v] && graph[u]![v]! < minEdge[v]!) {
        minEdge[v] = graph[u]![v]!;
        from[v] = u;
      }
    }
  }
  hooks.onConclude?.(totalWeight);
  return { totalWeight };
}
