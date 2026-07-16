// =============================================================================
// 地标最短路（ALT）· 纯算法实现
// 预选地标后用三角不等式构造 admissible 启发，跑 A*。
// =============================================================================

export interface WeightedGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}

export interface LandmarkHooks {
  onLandmark?: (ell: string) => void;
  onHeuristic?: (node: string, target: string, h: number) => void;
  onPop?: (node: string, g: number, f: number) => void;
  onDone?: (found: boolean, dist: number) => void;
}

/** 单源最短路（Dijkstra），返回 dist 表。 */
function dijkstra(input: WeightedGraphInput, src: string): Map<string, number> {
  const dist = new Map<string, number>();
  for (const n of input.nodes) dist.set(n, Infinity);
  if (!dist.has(src)) return dist;
  dist.set(src, 0);
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of input.nodes) adj.set(n, []);
  for (const e of input.edges) {
    adj.get(e.from)?.push({ to: e.to, w: e.weight });
    if (!input.directed) adj.get(e.to)?.push({ to: e.from, w: e.weight });
  }
  const visited = new Set<string>();
  for (let i = 0; i < input.nodes.length; i++) {
    let u: string | null = null;
    let best = Infinity;
    for (const n of input.nodes) {
      if (!visited.has(n) && (dist.get(n) ?? Infinity) < best) {
        best = dist.get(n)!;
        u = n;
      }
    }
    if (u === null) break;
    visited.add(u);
    for (const { to, w } of adj.get(u) ?? []) {
      const nd = dist.get(u)! + w;
      if (nd < (dist.get(to) ?? Infinity)) dist.set(to, nd);
    }
  }
  return dist;
}

export interface LandmarkPrecompute {
  // fromLandmark[ell] = d(ell, *)
  fromLandmark: Map<string, Map<string, number>>;
}

export function precomputeLandmarks(
  input: WeightedGraphInput,
  landmarks: readonly string[],
  hooks: LandmarkHooks = {},
): LandmarkPrecompute {
  const fromLandmark = new Map<string, Map<string, number>>();
  for (const ell of landmarks) {
    hooks.onLandmark?.(ell);
    fromLandmark.set(ell, dijkstra(input, ell));
  }
  return { fromLandmark };
}

/** 由地标距离构造 admissible 启发 h(s) ≤ d(s,t)。 */
export function landmarkHeuristic(
  pre: LandmarkPrecompute,
  target: string,
  hooks?: LandmarkHooks,
): (s: string) => number {
  return (s: string): number => {
    let best = 0;
    for (const [ell, dmap] of pre.fromLandmark) {
      const dt = dmap.get(target) ?? Infinity;
      const ds = dmap.get(s) ?? Infinity;
      if (Number.isFinite(dt) && Number.isFinite(ds)) {
        const lb = Math.abs(dt - ds);
        if (lb > best) best = lb;
      }
    }
    hooks?.onHeuristic?.(s, target, best);
    return best;
  };
}

export function landmarkShortestPath(
  input: WeightedGraphInput,
  pre: LandmarkPrecompute,
  source: string,
  target: string,
  hooks: LandmarkHooks = {},
): { found: boolean; dist: number } {
  const h = landmarkHeuristic(pre, target, hooks);
  const gScore = new Map<string, number>();
  for (const n of input.nodes) gScore.set(n, Infinity);
  if (!gScore.has(source)) return { found: false, dist: Infinity };
  gScore.set(source, 0);
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of input.nodes) adj.set(n, []);
  for (const e of input.edges) {
    adj.get(e.from)?.push({ to: e.to, w: e.weight });
    if (!input.directed) adj.get(e.to)?.push({ to: e.from, w: e.weight });
  }
  for (const list of adj.values()) list.sort((a, b) => (a.to < b.to ? -1 : 1));
  const open = new Set<string>([source]);
  const closed = new Set<string>();
  while (open.size > 0) {
    let u: string | null = null;
    let bestF = Infinity;
    for (const id of open) {
      const f = (gScore.get(id) ?? Infinity) + h(id);
      if (f < bestF) {
        bestF = f;
        u = id;
      }
    }
    if (u === null) break;
    const gu = gScore.get(u)!;
    open.delete(u);
    closed.add(u);
    hooks.onPop?.(u, gu, gu + h(u));
    if (u === target) {
      hooks.onDone?.(true, gu);
      return { found: true, dist: gu };
    }
    for (const { to: v, w } of adj.get(u) ?? []) {
      if (closed.has(v)) continue;
      const ng = gu + w;
      if (ng < (gScore.get(v) ?? Infinity)) {
        gScore.set(v, ng);
        open.add(v);
      }
    }
  }
  hooks.onDone?.(false, Infinity);
  return { found: false, dist: Infinity };
}
