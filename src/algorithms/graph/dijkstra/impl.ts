// =============================================================================
// Dijkstra 最短路径 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 仅适用于非负权边。
// =============================================================================

/** 加权图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}

/** Dijkstra 执行过程中的事件钩子。任一可选。 */
export interface DijkstraHooks {
  /** 选定一个尚未确定（非 settled）的节点为当前最小距离节点（松弛源）。 */
  onSettle?: (node: string, dist: number) => void;
  /** 松弛边 from→to：候选距离 newDist；若更新返回 true。 */
  onRelax?: (from: string, to: string, newDist: number, improved: boolean) => void;
  /** 算法开始，初始化距离（除起点 0 外均为 ∞）。 */
  onInit?: (source: string) => void;
}

/** 一条最短路径。 */
export interface ShortestPath {
  /** 到各节点的最短距离；不可达为 Infinity。 */
  dist: Map<string, number>;
  /** 前驱节点（用于回溯路径）。 */
  prev: Map<string, string | null>;
}

/** 从 source 出发，选当前未确定中 dist 最小者（线性扫描，确定顺序）。 */
function pickMinUnsettled(unsettled: Set<string>, dist: Map<string, number>): string | null {
  let best: string | null = null;
  let bestD = Infinity;
  for (const id of unsettled) {
    const d = dist.get(id) ?? Infinity;
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  }
  return best;
}

/**
 * Dijkstra 单源最短路径（非负权）。
 *
 * @param input 加权图
 * @param source 起点
 * @param hooks 可选事件钩子
 * @returns 最短距离表 dist 与前驱表 prev
 */
export function dijkstra(
  input: GraphInput,
  source: string,
  hooks: DijkstraHooks = {},
): ShortestPath {
  const { nodes, edges, directed = false } = input;
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const adjW = new Map<string, Array<{ to: string; w: number }>>();

  for (const n of nodes) {
    dist.set(n, Infinity);
    prev.set(n, null);
    adjW.set(n, []);
  }
  if (!dist.has(source)) return { dist, prev };
  dist.set(source, 0);
  hooks.onInit?.(source);

  for (const e of edges) {
    adjW.get(e.from)?.push({ to: e.to, w: e.weight });
    if (!directed) adjW.get(e.to)?.push({ to: e.from, w: e.weight });
  }
  // 邻接表按目标 id 排序，保证遍历顺序确定
  for (const list of adjW.values()) list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));

  const unsettled = new Set<string>(nodes);
  const settled = new Set<string>();

  while (unsettled.size > 0) {
    const u = pickMinUnsettled(unsettled, dist);
    if (u === null) break;
    const du = dist.get(u) ?? Infinity;
    if (du === Infinity) break; // 剩余均不可达

    unsettled.delete(u);
    settled.add(u);
    hooks.onSettle?.(u, du);

    for (const { to: v, w } of adjW.get(u) ?? []) {
      if (settled.has(v)) continue;
      const nd = du + w;
      const improved = nd < (dist.get(v) ?? Infinity);
      if (improved) {
        dist.set(v, nd);
        prev.set(v, u);
      }
      hooks.onRelax?.(u, v, nd, improved);
    }
  }

  return { dist, prev };
}

/** 由 prev 表回溯 source→target 的路径节点序列；不可达或断链返回 null。 */
export function reconstructPath(
  prev: Map<string, string | null>,
  source: string,
  target: string,
): string[] | null {
  if (!prev.has(target)) return null;
  const path: string[] = [];
  let cur: string | null = target;
  let guard = 0;
  while (cur !== null && guard <= prev.size) {
    path.push(cur);
    cur = prev.get(cur) ?? null;
    guard++;
  }
  // 链必须终止于 source（其 prev 为 null）；否则视为断链/环
  const head = path[path.length - 1];
  if (head !== source) return null;
  path.reverse();
  return path;
}
