// =============================================================================
// SPFA（Shortest Path Faster Algorithm）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 队列优化的 Bellman-Ford：只松弛「距离刚被更新」的节点扩散出的边，支持负权并判负环。
// =============================================================================

/** 加权图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}

/** SPFA 执行过程中的事件钩子。任一可选。 */
export interface SpfaHooks {
  /** 初始化距离表：除起点 0 外均为 ∞。 */
  onInit?: (source: string) => void;
  /** 节点 node 入队。 */
  onEnqueue?: (node: string) => void;
  /** 节点 node 出队（成为当前松弛源）。 */
  onDequeue?: (node: string) => void;
  /** 松弛边 from→to：候选 newDist；improved 表示是否更新。 */
  onRelax?: (from: string, to: string, newDist: number, improved: boolean) => void;
  /** 检测到负环（某节点入队次数达到 V）。 */
  onNegativeCycle?: (node: string) => void;
  /** 算法结束。hasNegativeCycle 表示是否检测到（源可达的）负环。 */
  onDone?: (hasNegativeCycle: boolean) => void;
}

/** 单源最短路径结果。 */
export interface SpfaResult {
  /** 到各节点的最短距离；不可达为 Infinity。 */
  dist: Map<string, number>;
  /** 前驱节点。 */
  prev: Map<string, string | null>;
  /** 是否检测到从源可达的负权环。 */
  hasNegativeCycle: boolean;
}

/**
 * SPFA 单源最短路径，**支持负权边**并检测负权环。
 *
 * 维护一个队列：起点入队；反复出队 `u`，对其每条出边 `u→v(w)` 松弛：
 * 若 `dist[u]+w < dist[v]`，更新 `dist[v]`、`prev[v]`，且若 `v` 不在队中则入队。
 * 记录每个节点入队次数，若某节点入队 `>= V` 次，则存在（源可达的）负环。
 *
 * 时间平均 `O(kE)`（k 较小），最坏 `O(V·E)`；空间 `O(V)`。
 *
 * @param input 加权图
 * @param source 起点
 * @param hooks 可选事件钩子
 */
export function spfa(input: GraphInput, source: string, hooks: SpfaHooks = {}): SpfaResult {
  const { nodes, edges, directed = false } = input;

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const inQueue = new Set<string>();
  const enqueueCount = new Map<string, number>();
  const adj = new Map<string, Array<{ to: string; w: number }>>();

  for (const n of nodes) {
    dist.set(n, Infinity);
    prev.set(n, null);
    enqueueCount.set(n, 0);
    adj.set(n, []);
  }
  for (const e of edges) {
    adj.get(e.from)?.push({ to: e.to, w: e.weight });
    if (!directed) adj.get(e.to)?.push({ to: e.from, w: e.weight });
  }
  for (const list of adj.values()) list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));

  if (!dist.has(source)) {
    hooks.onDone?.(false);
    return { dist, prev, hasNegativeCycle: false };
  }
  dist.set(source, 0);
  hooks.onInit?.(source);

  const queue: string[] = [source];
  inQueue.add(source);
  enqueueCount.set(source, 1);
  hooks.onEnqueue?.(source);

  const V = nodes.length;
  let hasNegativeCycle = false;

  while (queue.length > 0) {
    const u = queue.shift()!;
    inQueue.delete(u);
    hooks.onDequeue?.(u);
    if (hasNegativeCycle) continue;

    const du = dist.get(u) ?? Infinity;
    for (const { to: v, w } of adj.get(u) ?? []) {
      const nd = du + w;
      const improved = nd < (dist.get(v) ?? Infinity);
      if (improved) {
        dist.set(v, nd);
        prev.set(v, u);
        if (!inQueue.has(v)) {
          const cnt = (enqueueCount.get(v) ?? 0) + 1;
          enqueueCount.set(v, cnt);
          if (cnt >= V) {
            // 入队 V 次 → 存在负环
            hasNegativeCycle = true;
            hooks.onNegativeCycle?.(v);
          } else {
            queue.push(v);
            inQueue.add(v);
            hooks.onEnqueue?.(v);
          }
        }
      }
      hooks.onRelax?.(u, v, nd, improved);
    }
  }

  hooks.onDone?.(hasNegativeCycle);
  return { dist, prev, hasNegativeCycle };
}

/** 由 prev 表回溯 source→target 的路径节点序列；不可达或断链返回 null。 */
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
