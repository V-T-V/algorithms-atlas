// =============================================================================
// Dijkstra（贪心单源最短路）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 加权有向图的边。 */
export interface Edge {
  to: number;
  weight: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DijkstraGreedyHooks {
  onRelax?: (u: number, v: number, newDist: number) => void;
  onSettle?: (u: number, dist: number) => void;
}

export interface DijkstraGreedyResult {
  /** 从源到各点的最短距离（不可达为 Infinity）。 */
  dist: number[];
}

/**
 * Dijkstra：非负权图单源最短路。
 *
 * 贪心：每次从未确定点中选距离最小者 u，松弛其所有出边。
 * 用简单数组最小值选取（演示用，`O(V²)`）；生产环境用优先队列 `O(E log V)`。
 * @param graph 邻接表 graph[u] = [出边]
 * @param source 源点
 * @param hooks 可选的事件钩子
 */
export function dijkstraGreedy(
  graph: Edge[][],
  source: number,
  hooks: DijkstraGreedyHooks = {},
): DijkstraGreedyResult {
  const n = graph.length;
  const dist = new Array<number>(n).fill(Infinity);
  const settled = new Array<boolean>(n).fill(false);
  dist[source] = 0;

  for (let it = 0; it < n; it++) {
    // 选未确定中 dist 最小的
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!settled[i] && dist[i]! < best) {
        best = dist[i]!;
        u = i;
      }
    }
    if (u === -1 || best === Infinity) break;
    settled[u] = true;
    hooks.onSettle?.(u, dist[u]!);
    for (const e of graph[u] ?? []) {
      const nd = dist[u]! + e.weight;
      if (nd < dist[e.to]!) {
        dist[e.to] = nd;
        hooks.onRelax?.(u, e.to, nd);
      }
    }
  }
  return { dist };
}
