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
export interface DfsHooks {
  onVisit?: (v: string) => void;
  onResult?: (order: string[]) => void;
}
export function dfs(g: GraphInput, start: string, hooks: DfsHooks = {}): string[] {
  const adj = buildAdj(g);
  const visited = new Set<string>();
  const order: string[] = [];
  const go = (u: string) => {
    if (visited.has(u)) return;
    visited.add(u);
    order.push(u);
    hooks.onVisit?.(u);
    for (const v of adj.get(u) ?? []) go(v);
  };
  go(start);
  hooks.onResult?.(order);
  return order;
}
