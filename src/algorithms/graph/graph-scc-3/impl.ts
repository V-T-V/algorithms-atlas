// =============================================================================
// Kosaraju SCC
// =============================================================================

export interface TarjanGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface KosarajuHooks {
  onOrder?: (order: string[]) => void;
  onSCC?: (members: string[]) => void;
  onDone?: (sccs: string[][]) => void;
}

export function kosarajuSCC(input: TarjanGraphInput, hooks: KosarajuHooks = {}): string[][] {
  const adj = new Map<string, string[]>();
  const radj = new Map<string, string[]>();
  for (const n of input.nodes) {
    adj.set(n, []);
    radj.set(n, []);
  }
  for (const e of input.edges) {
    adj.get(e.from)?.push(e.to);
    radj.get(e.to)?.push(e.from);
  }
  for (const list of adj.values()) list.sort();
  for (const list of radj.values()) list.sort();
  const visited = new Set<string>();
  const order: string[] = [];
  const dfs1 = (u: string): void => {
    visited.add(u);
    for (const v of adj.get(u) ?? []) if (!visited.has(v)) dfs1(v);
    order.push(u);
  };
  for (const n of input.nodes) if (!visited.has(n)) dfs1(n);
  hooks.onOrder?.(order);
  const rvisited = new Set<string>();
  const sccs: string[][] = [];
  const dfs2 = (u: string, comp: string[]): void => {
    rvisited.add(u);
    comp.push(u);
    for (const v of radj.get(u) ?? []) if (!rvisited.has(v)) dfs2(v, comp);
  };
  for (let i = order.length - 1; i >= 0; i--) {
    const u = order[i]!;
    if (!rvisited.has(u)) {
      const comp: string[] = [];
      dfs2(u, comp);
      sccs.push(comp);
      hooks.onSCC?.(comp);
    }
  }
  hooks.onDone?.(sccs);
  return sccs;
}
