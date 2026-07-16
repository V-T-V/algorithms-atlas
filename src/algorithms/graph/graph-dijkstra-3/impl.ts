// =============================================================================
// Dijkstra + 前驱
// =============================================================================

export interface WeightedGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}

export interface DijkstraHooks {
  onPop?: (u: string, distU: number) => void;
  onRelax?: (from: string, to: string, oldDist: number, newDist: number) => void;
  onDone?: (dist: Map<string, number>, prev: Map<string, string | null>) => void;
}

export interface DijkstraResult {
  dist: Map<string, number>;
  prev: Map<string, string | null>;
}

export function buildWeightedAdj(
  input: WeightedGraphInput,
): Map<string, Array<{ to: string; w: number }>> {
  const { nodes, edges, directed = false } = input;
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    adj.get(e.from)?.push({ to: e.to, w: e.weight });
    if (!directed) adj.get(e.to)?.push({ to: e.from, w: e.weight });
  }
  return adj;
}

export function dijkstra(
  input: WeightedGraphInput,
  start: string,
  hooks: DijkstraHooks = {},
): DijkstraResult {
  const adj = buildWeightedAdj(input);
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  for (const n of input.nodes) {
    dist.set(n, Number.POSITIVE_INFINITY);
    prev.set(n, null);
  }
  dist.set(start, 0);
  // 简单优先队列：数组 + 取最小
  const pq: Array<{ id: string; d: number }> = [{ id: start, d: 0 }];
  const finalized = new Set<string>();
  while (pq.length > 0) {
    let minIdx = 0;
    for (let i = 1; i < pq.length; i++) if (pq[i]!.d < pq[minIdx]!.d) minIdx = i;
    const u = pq.splice(minIdx, 1)[0]!;
    if (finalized.has(u.id)) continue;
    finalized.add(u.id);
    hooks.onPop?.(u.id, u.d);
    for (const { to, w } of adj.get(u.id) ?? []) {
      const nd = dist.get(u.id)! + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        const old = dist.get(to) ?? Infinity;
        dist.set(to, nd);
        prev.set(to, u.id);
        hooks.onRelax?.(u.id, to, old, nd);
        pq.push({ id: to, d: nd });
      }
    }
  }
  hooks.onDone?.(dist, prev);
  return { dist, prev };
}

export function reconstructPath(prev: Map<string, string | null>, target: string): string[] | null {
  if (!prev.has(target)) return null;
  const path: string[] = [];
  let cur: string | null = target;
  while (cur) {
    path.push(cur);
    cur = prev.get(cur) ?? null;
  }
  path.reverse();
  return path;
}
