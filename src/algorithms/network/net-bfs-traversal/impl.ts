export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string; weight?: number }>;
  directed?: boolean;
}
export function buildAdj(g: GraphInput): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    if (!g.directed) adj.get(e.to)!.push(e.from);
  }
  for (const [k, v] of adj) v.sort();
  return adj;
}
export interface BfsHooks {
  onVisit?: (v: string, dist: number) => void;
  onResult?: (order: string[]) => void;
}
export function bfs(g: GraphInput, start: string, hooks: BfsHooks = {}): string[] {
  const adj = buildAdj(g);
  const visited = new Set<string>([start]);
  const q: Array<{ v: string; d: number }> = [{ v: start, d: 0 }];
  const order: string[] = [];
  while (q.length) {
    const { v, d } = q.shift()!;
    order.push(v);
    hooks.onVisit?.(v, d);
    for (const u of adj.get(v) ?? [])
      if (!visited.has(u)) {
        visited.add(u);
        q.push({ v: u, d: d + 1 });
      }
  }
  hooks.onResult?.(order);
  return order;
}
