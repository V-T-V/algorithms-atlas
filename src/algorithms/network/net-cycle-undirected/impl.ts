export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
}
export function buildAdj(g: GraphInput): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }
  return adj;
}
export interface CycleHooks {
  onVisit?: (v: string) => void;
  onResult?: (has: boolean) => void;
}
export function hasCycle(g: GraphInput, hooks: CycleHooks = {}): boolean {
  const adj = buildAdj(g);
  const visited = new Set<string>();
  const dfs = (u: string, parent: string | null): boolean => {
    visited.add(u);
    hooks.onVisit?.(u);
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) {
        if (dfs(v, u)) return true;
      } else if (v !== parent) return true;
    }
    return false;
  };
  for (const s of g.nodes)
    if (!visited.has(s) && dfs(s, null)) {
      hooks.onResult?.(true);
      return true;
    }
  hooks.onResult?.(false);
  return false;
}
