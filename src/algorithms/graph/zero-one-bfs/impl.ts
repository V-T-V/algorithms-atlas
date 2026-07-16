// =============================================================================
// 0-1 BFS · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 适用于边权只有 0 或 1 的图：用双端队列，权 0 的松弛从队首入队、权 1 从队尾入队，
// 保持队列「两段单调」，从而 O(V+E) 求单源最短路（替代 Dijkstra 的 O(E log V)）。
// =============================================================================

/** 加权图输入（边权必须为 0 或 1）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  source: string;
  directed?: boolean;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface ZeroOneBfsHooks {
  /** 从 source 初始化距离（起点 0，其余 ∞）。 */
  onInit?: (source: string) => void;
  /** 取出队首节点 u（距离 du）进行松弛。 */
  onPop?: (u: string, dist: number) => void;
  /** 松弛边 from→to：候选 newDist；weight 为 0 或 1；improved 表示是否更新。 */
  onRelax?: (from: string, to: string, weight: number, newDist: number, improved: boolean) => void;
  /** 算法完成：每点最短距离。 */
  onDone?: (dist: Map<string, number>) => void;
}

export interface ZeroOneBfsResult {
  dist: Map<string, number>;
  prev: Map<string, string | null>;
}

/**
 * 0-1 BFS 单源最短路。
 *
 * @param input 图（边权 ∈ {0,1}）+ 起点
 * @param hooks 可选事件钩子
 * @returns 距离与前驱
 */
export function zeroOneBfs(input: GraphInput, hooks: ZeroOneBfsHooks = {}): ZeroOneBfsResult {
  const { nodes, edges, source, directed = false } = input;
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  for (const n of nodes) {
    dist.set(n, Infinity);
    prev.set(n, null);
  }
  if (!nodes.includes(source)) return { dist, prev };
  dist.set(source, 0);
  hooks.onInit?.(source);

  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (e.weight !== 0 && e.weight !== 1) {
      // 非法权值：仍按一般情形处理（退化），但本算法假设 0/1
    }
    adj.get(e.from)?.push({ to: e.to, w: e.weight });
    if (!directed) adj.get(e.to)?.push({ to: e.from, w: e.weight });
  }

  // 双端队列（数组 + 头尾指针）
  const deque: string[] = [source];
  const inQueue = new Set<string>([source]);

  while (deque.length > 0) {
    const u = deque.shift()!;
    inQueue.delete(u);
    const du = dist.get(u) ?? Infinity;
    hooks.onPop?.(u, du);
    for (const { to, w } of adj.get(u) ?? []) {
      const nd = du + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        prev.set(to, u);
        hooks.onRelax?.(u, to, w, nd, true);
        if (!inQueue.has(to)) {
          if (w === 0) deque.unshift(to);
          else deque.push(to);
          inQueue.add(to);
        }
      } else {
        hooks.onRelax?.(u, to, w, nd, false);
      }
    }
  }

  hooks.onDone?.(new Map(dist));
  return { dist, prev };
}
