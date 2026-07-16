export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
}
export interface TopoHooks {
  onPop?: (v: string) => void;
  onResult?: (order: string[], hasCycle: boolean) => void;
}
export function topologicalSort(
  g: GraphInput,
  hooks: TopoHooks = {},
): { order: string[]; hasCycle: boolean } {
  const indeg = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) {
    indeg.set(n, 0);
    adj.set(n, []);
  }
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1);
  }
  const q: string[] = [];
  for (const [n, d] of indeg) if (d === 0) q.push(n);
  const order: string[] = [];
  while (q.length) {
    const u = q.shift()!;
    order.push(u);
    hooks.onPop?.(u);
    for (const v of adj.get(u) ?? []) {
      indeg.set(v, (indeg.get(v) ?? 0) - 1);
      if (indeg.get(v) === 0) q.push(v);
    }
  }
  const hasCycle = order.length !== g.nodes.length;
  hooks.onResult?.(order, hasCycle);
  return { order, hasCycle };
}
