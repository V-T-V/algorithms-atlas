// =============================================================================
// Kruskal · 并查集
// =============================================================================

export interface KruskalGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

export interface KruskalHooks {
  onSort?: (order: Array<{ from: string; to: string; weight: number }>) => void;
  onConsider?: (from: string, to: string, weight: number, accept: boolean) => void;
  onUnion?: (a: string, b: string) => void;
  onDone?: (
    totalWeight: number,
    treeEdges: Array<{ from: string; to: string; weight: number }>,
  ) => void;
}

export interface KruskalResult {
  totalWeight: number;
  treeEdges: Array<{ from: string; to: string; weight: number }>;
}

export function kruskal(input: KruskalGraphInput, hooks: KruskalHooks = {}): KruskalResult {
  const parent = new Map<string, string>();
  for (const n of input.nodes) parent.set(n, n);
  const find = (x: string): string => {
    let cur = x;
    while (parent.get(cur) !== cur) cur = parent.get(cur)!;
    const p = cur;
    let walk = x;
    while (parent.get(walk) !== p) {
      const next = parent.get(walk)!;
      parent.set(walk, p);
      walk = next;
    }
    return p;
  };
  const union = (a: string, b: string): boolean => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent.set(ra, rb);
    return true;
  };
  const sorted = [...input.edges].sort((a, b) => a.weight - b.weight);
  hooks.onSort?.(sorted);
  const treeEdges: Array<{ from: string; to: string; weight: number }> = [];
  let total = 0;
  for (const e of sorted) {
    const accept = union(e.from, e.to);
    hooks.onConsider?.(e.from, e.to, e.weight, accept);
    if (accept) {
      treeEdges.push(e);
      total += e.weight;
      hooks.onUnion?.(e.from, e.to);
      if (treeEdges.length === input.nodes.length - 1) break;
    }
  }
  hooks.onDone?.(total, treeEdges);
  return { totalWeight: total, treeEdges };
}
