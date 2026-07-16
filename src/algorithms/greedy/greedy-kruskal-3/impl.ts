// Kruskal MST · 实现
export interface Edge {
  u: number;
  v: number;
  w: number;
}
export interface KruskalHooks {
  onConsider?: (edge: Edge, accept: boolean) => void;
  onConclude?: (totalWeight: number, mstEdges: Edge[]) => void;
}
export interface KruskalResult {
  totalWeight: number;
  mstEdges: Edge[];
}
export function greedyKruskal3(
  n: number,
  edges: ReadonlyArray<Edge>,
  hooks: KruskalHooks = {},
): KruskalResult {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x]!)));
  const union = (a: number, b: number): boolean => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent[ra] = rb;
    return true;
  };
  const sorted = [...edges].sort((a, b) => a.w - b.w);
  const mstEdges: Edge[] = [];
  let totalWeight = 0;
  for (const e of sorted) {
    const accept = union(e.u, e.v);
    hooks.onConsider?.(e, accept);
    if (accept) {
      mstEdges.push(e);
      totalWeight += e.w;
    }
    if (mstEdges.length === n - 1) break;
  }
  hooks.onConclude?.(totalWeight, mstEdges);
  return { totalWeight, mstEdges };
}
