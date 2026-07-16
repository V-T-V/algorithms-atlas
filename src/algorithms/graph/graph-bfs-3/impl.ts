// =============================================================================
// 分层 BFS
// =============================================================================

export interface GraphInput3 {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  directed?: boolean;
}

export interface LayeredBfsHooks {
  onDiscover?: (node: string, parent: string | null, dist: number) => void;
  onVisit?: (node: string, dist: number) => void;
  onExamine?: (from: string, to: string) => void;
  onDone?: (order: string[], dist: Map<string, number>) => void;
}

export interface LayeredBfsResult {
  order: string[];
  dist: Map<string, number>;
}

export function buildAdj3(input: GraphInput3): Map<string, string[]> {
  const { nodes, edges, directed = false } = input;
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    if (!directed) adj.get(e.to)?.push(e.from);
  }
  for (const list of adj.values()) list.sort();
  return adj;
}

export function layeredBfs(
  input: GraphInput3,
  start: string,
  hooks: LayeredBfsHooks = {},
): LayeredBfsResult {
  const adj = buildAdj3(input);
  const visited = new Set<string>([start]);
  const dist = new Map<string, number>([[start, 0]]);
  const order: string[] = [];
  const queue: string[] = [start];
  hooks.onDiscover?.(start, null, 0);
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    const du = dist.get(u)!;
    hooks.onVisit?.(u, du);
    for (const v of adj.get(u) ?? []) {
      hooks.onExamine?.(u, v);
      if (!visited.has(v)) {
        visited.add(v);
        dist.set(v, du + 1);
        hooks.onDiscover?.(v, u, du + 1);
        queue.push(v);
      }
    }
  }
  hooks.onDone?.(order, dist);
  return { order, dist };
}
