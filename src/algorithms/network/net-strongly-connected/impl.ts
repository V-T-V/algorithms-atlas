export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
}
export interface SccHooks {
  onComponent?: (members: string[]) => void;
  onResult?: (n: number) => void;
}
export function kosaraju(g: GraphInput, hooks: SccHooks = {}): string[][] {
  const adj = new Map<string, string[]>(),
    radj = new Map<string, string[]>();
  for (const n of g.nodes) {
    adj.set(n, []);
    radj.set(n, []);
  }
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    radj.get(e.to)!.push(e.from);
  }
  const visited = new Set<string>();
  const order: string[] = [];
  const dfs1 = (u: string) => {
    visited.add(u);
    for (const v of adj.get(u) ?? []) if (!visited.has(v)) dfs1(v);
    order.push(u);
  };
  for (const s of g.nodes) if (!visited.has(s)) dfs1(s);
  const visited2 = new Set<string>();
  const comp: string[] = [];
  const dfs2 = (u: string) => {
    visited2.add(u);
    comp.push(u);
    for (const v of radj.get(u) ?? []) if (!visited2.has(v)) dfs2(v);
  };
  const comps: string[][] = [];
  for (let i = order.length - 1; i >= 0; i--) {
    const u = order[i]!;
    if (visited2.has(u)) continue;
    comp.length = 0;
    dfs2(u);
    comps.push([...comp]);
    hooks.onComponent?.([...comp]);
  }
  hooks.onResult?.(comps.length);
  return comps;
}
