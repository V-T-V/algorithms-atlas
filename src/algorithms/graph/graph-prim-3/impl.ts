// =============================================================================
// Prim 最小生成树
// =============================================================================

export interface PrimGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

export interface PrimHooks {
  onPick?: (u: string) => void;
  onRelax?: (from: string, to: string, w: number, oldKey: number, newKey: number) => void;
  onTreeEdge?: (u: string, v: string, w: number) => void;
  onDone?: (totalWeight: number, treeEdges: Array<{ u: string; v: string; w: number }>) => void;
}

export interface PrimResult {
  totalWeight: number;
  treeEdges: Array<{ u: string; v: string; w: number }>;
}

export function prim(input: PrimGraphInput, start: string, hooks: PrimHooks = {}): PrimResult {
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of input.nodes) adj.set(n, []);
  for (const e of input.edges) {
    adj.get(e.from)?.push({ to: e.to, w: e.weight });
    adj.get(e.to)?.push({ to: e.from, w: e.weight });
  }
  const INF = Number.POSITIVE_INFINITY;
  const key = new Map<string, number>();
  const inTree = new Set<string>();
  const parent = new Map<string, string | null>();
  for (const n of input.nodes) {
    key.set(n, INF);
    parent.set(n, null);
  }
  key.set(start, 0);
  const treeEdges: Array<{ u: string; v: string; w: number }> = [];
  let total = 0;
  for (let iter = 0; iter < input.nodes.length; iter++) {
    // 选 key 最小的未纳入点
    let u: string | null = null;
    let best = INF;
    for (const n of input.nodes) {
      if (!inTree.has(n) && (key.get(n) ?? INF) < best) {
        best = key.get(n)!;
        u = n;
      }
    }
    if (u === null) break;
    inTree.add(u);
    hooks.onPick?.(u);
    const p = parent.get(u);
    if (p !== null && p !== undefined) {
      treeEdges.push({ u: p, v: u, w: key.get(u)! });
      total += key.get(u)!;
      hooks.onTreeEdge?.(p, u, key.get(u)!);
    } else if (u === start) {
      // 起点无入边
    }
    for (const { to, w } of adj.get(u) ?? []) {
      if (!inTree.has(to) && w < (key.get(to) ?? INF)) {
        const old = key.get(to) ?? INF;
        key.set(to, w);
        parent.set(to, u);
        hooks.onRelax?.(u, to, w, old, w);
      }
    }
  }
  hooks.onDone?.(total, treeEdges);
  return { totalWeight: total, treeEdges };
}
