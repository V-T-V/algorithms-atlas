// =============================================================================
// DAG 最短路（DAG Shortest Path）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// DAG 上单源最短路：先拓扑排序，再按拓扑序松弛每条边，O(V+E) 且支持负权边（无环故无负环）。
// =============================================================================

/** 有向无环图输入（有向）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  source: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface ShortestDagHooks {
  /** 给出拓扑序。 */
  onTopoOrder?: (order: string[]) => void;
  /** 按拓扑序处理节点 u（距离 du）。 */
  onVisit?: (u: string, dist: number) => void;
  /** 松弛边 from→to：候选 newDist；improved 表示是否更新。 */
  onRelax?: (from: string, to: string, newDist: number, improved: boolean) => void;
  /** 算法完成：每点最短距离。 */
  onDone?: (dist: Map<string, number>) => void;
}

export interface ShortestDagResult {
  /** 拓扑序。 */
  topoOrder: string[];
  dist: Map<string, number>;
  prev: Map<string, string | null>;
  /** 若输入含环，hasCycle=true 且结果不可用。 */
  hasCycle: boolean;
}

/**
 * DAG 单源最短路（拓扑排序 + 松弛）。
 *
 * @param input DAG + 起点
 * @param hooks 可选事件钩子
 * @returns 距离、前驱、拓扑序（若含环则 hasCycle=true）
 */
export function shortestDag(input: GraphInput, hooks: ShortestDagHooks = {}): ShortestDagResult {
  const { nodes, edges, source } = input;
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  const indeg = new Map<string, number>();
  for (const n of nodes) {
    adj.set(n, []);
    indeg.set(n, 0);
  }
  for (const e of edges) {
    adj.get(e.from)?.push({ to: e.to, w: e.weight });
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1);
  }

  // Kahn 拓扑排序
  const queue: string[] = [];
  for (const n of nodes) if ((indeg.get(n) ?? 0) === 0) queue.push(n);
  const topoOrder: string[] = [];
  const indeg2 = new Map(indeg);
  while (queue.length > 0) {
    const u = queue.shift()!;
    topoOrder.push(u);
    for (const { to } of adj.get(u) ?? []) {
      indeg2.set(to, (indeg2.get(to) ?? 0) - 1);
      if ((indeg2.get(to) ?? 0) === 0) queue.push(to);
    }
  }
  const hasCycle = topoOrder.length !== nodes.length;
  hooks.onTopoOrder?.(topoOrder);

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  for (const n of nodes) {
    dist.set(n, Infinity);
    prev.set(n, null);
  }
  if (nodes.includes(source)) dist.set(source, 0);

  if (hasCycle) {
    return { topoOrder, dist, prev, hasCycle: true };
  }

  // 按拓扑序松弛
  for (const u of topoOrder) {
    const du = dist.get(u) ?? Infinity;
    hooks.onVisit?.(u, du);
    if (du === Infinity) continue; // 源不可达的点跳过
    for (const { to, w } of adj.get(u) ?? []) {
      const nd = du + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        prev.set(to, u);
        hooks.onRelax?.(u, to, nd, true);
      } else {
        hooks.onRelax?.(u, to, nd, false);
      }
    }
  }

  hooks.onDone?.(new Map(dist));
  return { topoOrder, dist, prev, hasCycle: false };
}
