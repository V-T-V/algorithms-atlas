// =============================================================================
// DAG 最短路
// =============================================================================

export interface DagGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

export interface DagSpHooks {
  onTopo?: (order: string[]) => void;
  onRelax?: (from: string, to: string, newDist: number) => void;
  onDone?: (dist: Map<string, number>, prev: Map<string, string | null>) => void;
}

export function dagShortestPath(
  input: DagGraphInput,
  start: string,
  hooks: DagSpHooks = {},
): { dist: Map<string, number>; prev: Map<string, string | null> } {
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  const indeg = new Map<string, number>();
  for (const n of input.nodes) {
    adj.set(n, []);
    indeg.set(n, 0);
  }
  for (const e of input.edges) {
    adj.get(e.from)?.push({ to: e.to, w: e.weight });
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1);
  }
  // Kahn 拓扑
  const queue: string[] = [];
  for (const n of input.nodes) if ((indeg.get(n) ?? 0) === 0) queue.push(n);
  const topo: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    topo.push(u);
    for (const { to } of adj.get(u) ?? []) {
      indeg.set(to, (indeg.get(to) ?? 0) - 1);
      if ((indeg.get(to) ?? 0) === 0) queue.push(to);
    }
  }
  hooks.onTopo?.(topo);
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  for (const n of input.nodes) {
    dist.set(n, Number.POSITIVE_INFINITY);
    prev.set(n, null);
  }
  dist.set(start, 0);
  for (const u of topo) {
    const du = dist.get(u) ?? Infinity;
    if (!Number.isFinite(du)) continue;
    for (const { to, w } of adj.get(u) ?? []) {
      const nd = du + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        prev.set(to, u);
        hooks.onRelax?.(u, to, nd);
      }
    }
  }
  hooks.onDone?.(dist, prev);
  return { dist, prev };
}
