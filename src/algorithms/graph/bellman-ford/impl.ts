// =============================================================================
// Bellman-Ford 最短路径 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 可处理负权边，并检测从源可达的负权环。
// =============================================================================

/** 加权图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}

/** Bellman-Ford 执行过程中的事件钩子。任一可选。 */
export interface BellmanFordHooks {
  /** 初始化距离表：除起点 0 外均为 ∞。 */
  onInit?: (source: string) => void;
  /** 进入第 round（1..V-1）轮全图松弛。 */
  onRound?: (round: number) => void;
  /** 松弛边 from→to：候选 newDist；improved 表示是否更新。 */
  onRelax?: (from: string, to: string, newDist: number, improved: boolean) => void;
  /** 第 V 轮检测到可继续松弛的边 → 存在负环。 */
  onNegativeEdge?: (from: string, to: string) => void;
  /** 算法结束。hasNegativeCycle 表示是否检测到（源可达的）负环。 */
  onDone?: (hasNegativeCycle: boolean) => void;
}

/** 一条最短路径结果。 */
export interface ShortestPath {
  /** 到各节点的最短距离；不可达为 Infinity，被负环污染的为 -Infinity。 */
  dist: Map<string, number>;
  /** 前驱节点（用于回溯路径）。 */
  prev: Map<string, string | null>;
  /** 是否检测到从源可达的负权环。 */
  hasNegativeCycle: boolean;
  /** 受负环影响（距离可无限变小）的节点集合。 */
  negative: Set<string>;
}

/**
 * Bellman-Ford 单源最短路径，**支持负权边**并检测负权环。
 *
 * - 初始化 `dist[source]=0`，其余 `∞`
 * - 重复 `V-1` 轮：对**每条边** `u→v(w)` 尝试松弛 `dist[v] = min(dist[v], dist[u]+w)`
 * - 再做第 `V` 轮：若仍有边可松弛，则存在从源可达的负环；
 *   把这些「可继续松弛」的可达节点标记为负环影响点（dist 置 `-∞`）
 *
 * 第 `V-1` 轮后所有最短路已收敛（最短路径至多 V-1 条边）；故第 V 轮还能松弛即证负环。
 *
 * 时间 `O(V·E)`，空间 `O(V)`。
 *
 * @param input 加权图
 * @param source 起点
 * @param hooks 可选事件钩子
 */
export function bellmanFord(
  input: GraphInput,
  source: string,
  hooks: BellmanFordHooks = {},
): ShortestPath {
  const { nodes, edges, directed = false } = input;

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  for (const n of nodes) {
    dist.set(n, Infinity);
    prev.set(n, null);
  }

  const edgeList: Array<{ from: string; to: string; weight: number }> = [];
  for (const e of edges) {
    edgeList.push({ from: e.from, to: e.to, weight: e.weight });
    if (!directed) edgeList.push({ from: e.to, to: e.from, weight: e.weight });
  }
  // 保证遍历顺序确定
  edgeList.sort((a, b) =>
    a.from < b.from ? -1 : a.from > b.from ? 1 : a.to < b.to ? -1 : a.to > b.to ? 1 : 0,
  );

  if (!dist.has(source)) {
    hooks.onDone?.(false);
    return { dist, prev, hasNegativeCycle: false, negative: new Set() };
  }
  dist.set(source, 0);
  hooks.onInit?.(source);

  const V = nodes.length;

  // V-1 轮松弛
  for (let round = 1; round <= V - 1; round++) {
    hooks.onRound?.(round);
    for (const e of edgeList) {
      const du = dist.get(e.from) ?? Infinity;
      if (du === Infinity) {
        hooks.onRelax?.(e.from, e.to, Infinity, false);
        continue;
      }
      const nd = du + e.weight;
      const improved = nd < (dist.get(e.to) ?? Infinity);
      if (improved) {
        dist.set(e.to, nd);
        prev.set(e.to, e.from);
      }
      hooks.onRelax?.(e.from, e.to, nd, improved);
    }
  }

  // 第 V 轮：检测负环
  const negative = new Set<string>();
  let hasNegativeCycle = false;
  for (const e of edgeList) {
    const du = dist.get(e.from) ?? Infinity;
    if (du === Infinity) continue;
    const nd = du + e.weight;
    if (nd < (dist.get(e.to) ?? Infinity)) {
      hasNegativeCycle = true;
      hooks.onNegativeEdge?.(e.from, e.to);
      negative.add(e.from);
      negative.add(e.to);
    }
  }

  // 传播：从负环点出发可达的所有点都标记为受影响，距离置 -∞
  if (hasNegativeCycle) {
    let changed = true;
    while (changed) {
      changed = false;
      for (const e of edgeList) {
        if (negative.has(e.from) && !negative.has(e.to)) {
          negative.add(e.to);
          changed = true;
        }
      }
    }
    for (const id of negative) {
      dist.set(id, -Infinity);
      prev.set(id, null);
    }
  }

  hooks.onDone?.(hasNegativeCycle);
  return { dist, prev, hasNegativeCycle, negative };
}

/** 由 prev 表回溯 source→target 的路径节点序列；不可达、断链或受负环影响返回 null。 */
export function reconstructPath(
  prev: Map<string, string | null>,
  source: string,
  target: string,
): string[] | null {
  if (!prev.has(target)) return null;
  if (prev.get(target) === null && target !== source) return null;
  const path: string[] = [];
  let cur: string | null = target;
  let guard = 0;
  while (cur !== null && guard <= prev.size) {
    path.push(cur);
    cur = prev.get(cur) ?? null;
    guard++;
  }
  const head = path[path.length - 1];
  if (head !== source) return null;
  path.reverse();
  return path;
}
