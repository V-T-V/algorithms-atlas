// =============================================================================
// Johnson 全源最短路（All-Pairs Shortest Paths）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 核心：加一个超级源点 s，Bellman-Ford 求各点势能 h(v)；用 h 重赋权使所有边非负；
//      再对每个原点各跑一次 Dijkstra，最后把势能加回，得到全源最短路。
// =============================================================================

/** 加权图输入（有向图）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}

/** Johnson 执行过程中的事件钩子。任一可选。 */
export interface JohnsonHooks {
  /** 引入超级源点，势能 h 全 0。 */
  onInit?: () => void;
  /** Bellman-Ford 第 round 轮松弛。 */
  onBellmanRound?: (round: number) => void;
  /** 松弛超级源点的边 from→to：候选 newDist；improved 是否更新。 */
  onBellmanRelax?: (from: string, to: string, newDist: number, improved: boolean) => void;
  /** 检测到负权环。 */
  onNegativeCycle?: () => void;
  /** 重赋权完成，得到势能表 h。 */
  onReweighted?: (h: Map<string, number>) => void;
  /** 以 source 为起点跑完一次 Dijkstra，得到该源的最短路（重赋权坐标下）。 */
  onDijkstraSource?: (source: string) => void;
  /** 全部完成。hasNegativeCycle 表示是否存在负环。 */
  onDone?: (hasNegativeCycle: boolean) => void;
}

/** 结果：全源距离矩阵（不可达为 Infinity）+ 各源前驱表。 */
export interface JohnsonResult {
  /** dist.get(u)!.get(v) = u→v 最短距离。 */
  dist: Map<string, Map<string, number>>;
  /** 各源的前驱表，用于回溯路径。 */
  prev: Map<string, Map<string, string | null>>;
  hasNegativeCycle: boolean;
}

/** 迭代版 Bellman-Ford（从虚拟源点出发，源点到所有点权为 0）。返回 h 或 null（负环）。 */
function bellmanFordFromSuper(
  nodes: readonly string[],
  edgeList: ReadonlyArray<{ from: string; to: string; weight: number }>,
  hooks: JohnsonHooks,
): Map<string, number> | null {
  const h = new Map<string, number>();
  for (const n of nodes) h.set(n, 0); // 虚拟源点到各点为 0

  const V = nodes.length;
  for (let round = 1; round <= V - 1; round++) {
    hooks.onBellmanRound?.(round);
    let changed = false;
    for (const e of edgeList) {
      const du = h.get(e.from) ?? Infinity;
      if (du === Infinity) continue;
      const nd = du + e.weight;
      const improved = nd < (h.get(e.to) ?? Infinity);
      if (improved) {
        h.set(e.to, nd);
        changed = true;
      }
      hooks.onBellmanRelax?.(e.from, e.to, nd, improved);
    }
    if (!changed) break;
  }

  // 第 V 轮：检测负环
  for (const e of edgeList) {
    const du = h.get(e.from) ?? Infinity;
    if (du === Infinity) continue;
    if (du + e.weight < (h.get(e.to) ?? Infinity)) {
      hooks.onNegativeCycle?.();
      return null;
    }
  }
  return h;
}

/** 线性扫描 Dijkstra（非负权），返回单源 dist/prev。 */
function dijkstraSingle(
  nodes: readonly string[],
  adj: Map<string, Array<{ to: string; w: number }>>,
  source: string,
): { dist: Map<string, number>; prev: Map<string, string | null> } {
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  for (const n of nodes) {
    dist.set(n, Infinity);
    prev.set(n, null);
  }
  dist.set(source, 0);
  const settled = new Set<string>();
  const unsettled = new Set<string>(nodes);
  while (unsettled.size > 0) {
    let u: string | null = null;
    let best = Infinity;
    for (const id of unsettled) {
      const d = dist.get(id) ?? Infinity;
      if (d < best) {
        best = d;
        u = id;
      }
    }
    if (u === null || best === Infinity) break;
    unsettled.delete(u);
    settled.add(u);
    const du = dist.get(u) ?? Infinity;
    for (const { to: v, w } of adj.get(u) ?? []) {
      if (settled.has(v)) continue;
      const nd = du + w;
      if (nd < (dist.get(v) ?? Infinity)) {
        dist.set(v, nd);
        prev.set(v, u);
      }
    }
  }
  return { dist, prev };
}

/**
 * Johnson 全源最短路（有向图，支持负权，可判负环）。
 *
 * 1. 引入超级源点 s，s→各点权 0；Bellman-Ford 求势能 `h(v)=dist(s,v)`
 * 2. 重赋权：`w'(u,v) = w(u,v) + h(u) - h(v) >= 0`（最短路性质保证非负）
 * 3. 对每个原点跑 Dijkstra（非负权）；最后 `dist(u,v) = dist'(u,v) + h(v) - h(u)` 还原
 *
 * 时间 `O(V·E + V·(V+E) log V)`，本实现 Dijkstra 为线性扫描故 `O(V²·E)`。
 *
 * @param input 加权有向图
 * @param hooks 可选事件钩子
 */
export function johnson(input: GraphInput, hooks: JohnsonHooks = {}): JohnsonResult {
  const { nodes, edges, directed = false } = input;
  const dist: Map<string, Map<string, number>> = new Map();
  const prev: Map<string, Map<string, string | null>> = new Map();
  const empty = (): { dist: Map<string, number>; prev: Map<string, string | null> } => ({
    dist: new Map(nodes.map((n) => [n, Infinity])),
    prev: new Map(nodes.map((n) => [n, null])),
  });

  // 边列表（含无向图的反向边）
  const edgeList: Array<{ from: string; to: string; weight: number }> = [];
  for (const e of edges) {
    edgeList.push({ from: e.from, to: e.to, weight: e.weight });
    if (!directed) edgeList.push({ from: e.to, to: e.from, weight: e.weight });
  }
  edgeList.sort((a, b) =>
    a.from < b.from ? -1 : a.from > b.from ? 1 : a.to < b.to ? -1 : a.to > b.to ? 1 : 0,
  );

  hooks.onInit?.();
  const h = bellmanFordFromSuper(nodes, edgeList, hooks);
  if (h === null) {
    hooks.onDone?.(true);
    for (const n of nodes) {
      const e = empty();
      dist.set(n, e.dist);
      prev.set(n, e.prev);
    }
    return { dist, prev, hasNegativeCycle: true };
  }
  hooks.onReweighted?.(h);

  // 重赋权后的邻接表
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edgeList) {
    const w = e.weight + (h.get(e.from) ?? 0) - (h.get(e.to) ?? 0);
    adj.get(e.from)!.push({ to: e.to, w });
  }
  for (const list of adj.values()) list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));

  // 每个原点 Dijkstra + 还原势能
  for (const s of nodes) {
    hooks.onDijkstraSource?.(s);
    const { dist: dPrime, prev: p } = dijkstraSingle(nodes, adj, s);
    const restore = new Map<string, number>();
    for (const v of nodes) {
      const dpv = dPrime.get(v) ?? Infinity;
      if (dpv === Infinity) restore.set(v, Infinity);
      else restore.set(v, dpv + (h.get(v) ?? 0) - (h.get(s) ?? 0));
    }
    dist.set(s, restore);
    prev.set(s, p);
  }

  hooks.onDone?.(false);
  return { dist, prev, hasNegativeCycle: false };
}
