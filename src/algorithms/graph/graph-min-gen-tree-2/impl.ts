// =============================================================================
// 最小生成树（Prim）· 纯算法实现
// =============================================================================

export interface WeightedGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

export interface PrimHooks {
  onAddVertex?: (v: string) => void;
  onAddEdge?: (from: string, to: string, weight: number) => void;
  onDone?: (
    totalWeight: number,
    edges: Array<{ from: string; to: string; weight: number }>,
  ) => void;
}

export interface PrimResult {
  totalWeight: number;
  edges: Array<{ from: string; to: string; weight: number }>;
}

export function primMst(
  input: WeightedGraphInput,
  start: string,
  hooks: PrimHooks = {},
): PrimResult {
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of input.nodes) adj.set(n, []);
  for (const e of input.edges) {
    adj.get(e.from)?.push({ to: e.to, w: e.weight });
    adj.get(e.to)?.push({ to: e.from, w: e.weight });
  }
  if (!adj.has(start)) return { totalWeight: 0, edges: [] };
  const inTree = new Set<string>([start]);
  const key = new Map<string, number>();
  const via = new Map<string, string>();
  for (const n of input.nodes) key.set(n, Infinity);
  key.set(start, 0);
  for (const { to, w } of adj.get(start) ?? []) {
    if (w < (key.get(to) ?? Infinity)) {
      key.set(to, w);
      via.set(to, start);
    }
  }
  hooks.onAddVertex?.(start);
  const mstEdges: Array<{ from: string; to: string; weight: number }> = [];
  let total = 0;

  while (inTree.size < input.nodes.length) {
    let u: string | null = null;
    let best = Infinity;
    for (const n of input.nodes) {
      if (!inTree.has(n) && (key.get(n) ?? Infinity) < best) {
        best = key.get(n)!;
        u = n;
      }
    }
    if (u === null) break; // 图不连通
    inTree.add(u);
    const from = via.get(u)!;
    total += best;
    mstEdges.push({ from, to: u, weight: best });
    hooks.onAddVertex?.(u);
    hooks.onAddEdge?.(from, u, best);
    for (const { to, w } of adj.get(u) ?? []) {
      if (!inTree.has(to) && w < (key.get(to) ?? Infinity)) {
        key.set(to, w);
        via.set(to, u);
      }
    }
  }
  hooks.onDone?.(total, mstEdges);
  return { totalWeight: total, edges: mstEdges };
}
