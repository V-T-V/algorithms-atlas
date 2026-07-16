// =============================================================================
// 双向 Dijkstra · 纯算法实现
// =============================================================================

export interface WeightedGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}

export interface BiDijkstraHooks {
  onSettle?: (side: 'fwd' | 'bwd', node: string, dist: number) => void;
  onMeet?: (mu: number) => void;
  onDone?: (found: boolean, dist: number) => void;
}

export function bidirectionalDijkstra(
  input: WeightedGraphInput,
  source: string,
  target: string,
  hooks: BiDijkstraHooks = {},
): { found: boolean; dist: number } {
  if (source === target) {
    hooks.onDone?.(true, 0);
    return { found: true, dist: 0 };
  }
  const fwd = new Map<string, Array<{ to: string; w: number }>>();
  const bwd = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of input.nodes) {
    fwd.set(n, []);
    bwd.set(n, []);
  }
  for (const e of input.edges) {
    fwd.get(e.from)?.push({ to: e.to, w: e.weight });
    bwd.get(e.to)?.push({ to: e.from, w: e.weight });
    if (!input.directed) {
      fwd.get(e.to)?.push({ to: e.from, w: e.weight });
      bwd.get(e.from)?.push({ to: e.to, w: e.weight });
    }
  }
  const distF = new Map<string, number>();
  const distB = new Map<string, number>();
  for (const n of input.nodes) {
    distF.set(n, Infinity);
    distB.set(n, Infinity);
  }
  if (!distF.has(source) || !distB.has(target)) {
    hooks.onDone?.(false, Infinity);
    return { found: false, dist: Infinity };
  }
  distF.set(source, 0);
  distB.set(target, 0);
  const settledF = new Set<string>();
  const settledB = new Set<string>();
  let mu = Infinity;

  const step = (side: 'fwd' | 'bwd'): string | null => {
    const dist = side === 'fwd' ? distF : distB;
    let u: string | null = null;
    let best = Infinity;
    for (const n of input.nodes) {
      if ((side === 'fwd' ? settledF : settledB).has(n)) continue;
      const d = dist.get(n) ?? Infinity;
      if (d < best) {
        best = d;
        u = n;
      }
    }
    if (u === null || best === Infinity) return null;
    if (side === 'fwd') settledF.add(u);
    else settledB.add(u);
    hooks.onSettle?.(side, u, best);
    // 相遇检测
    const other = side === 'fwd' ? distB : distF;
    if (other.has(u) && Number.isFinite(other.get(u)!)) {
      const total = best + other.get(u)!;
      if (total < mu) {
        mu = total;
        hooks.onMeet?.(mu);
      }
    }
    // 松弛
    const adj = side === 'fwd' ? fwd : bwd;
    for (const { to, w } of adj.get(u) ?? []) {
      const nd = best + w;
      if (nd < (dist.get(to) ?? Infinity)) dist.set(to, nd);
    }
    return u;
  };

  for (let i = 0; i < input.nodes.length * 4; i++) {
    const fMin = Math.min(
      ...input.nodes.filter((n) => !settledF.has(n)).map((n) => distF.get(n) ?? Infinity),
    );
    const bMin = Math.min(
      ...input.nodes.filter((n) => !settledB.has(n)).map((n) => distB.get(n) ?? Infinity),
    );
    if (Math.min(fMin, bMin) >= mu) break;
    if (fMin <= bMin) step('fwd');
    else step('bwd');
  }
  const found = mu < Infinity;
  hooks.onDone?.(found, mu);
  return { found, dist: mu };
}
