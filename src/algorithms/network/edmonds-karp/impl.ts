// =============================================================================
// Edmonds-Karp 最大流 · 纯算法实现
// BFS 找最短增广路的 Ford-Fulkerson。零 DOM 依赖，可独立单测。
// 节点用 0..n-1 的整数下标表示。
// =============================================================================

export interface FlowEdgeInput {
  from: number;
  to: number;
  cap: number;
}

/** 事件钩子。 */
export interface EdmondsKarpHooks {
  /** 找到一条增广路 path（节点下标序列），瓶颈 flow，更新后总流量 totalFlow。 */
  onAugment?: (path: number[], flow: number, totalFlow: number) => void;
  /** 本轮 BFS 未找到增广路，算法结束。给出最终总流量。 */
  onNoPath?: (totalFlow: number) => void;
}

/** 残量弧：to + 容量 + 反向弧在 to 的邻接表中的下标。 */
interface Arc {
  to: number;
  cap: number;
  rev: number;
}

/**
 * Edmonds-Karp 最大流。
 *
 * @param n 节点数（节点编号 0..n-1）
 * @param edges 边列表 {from, to, cap}，cap >= 0
 * @param s 源点
 * @param t 汇点
 * @param hooks 可选事件钩子
 * @returns 最大流值
 */
export function edmondsKarp(
  n: number,
  edges: readonly FlowEdgeInput[],
  s: number,
  t: number,
  hooks: EdmondsKarpHooks = {},
): number {
  if (n <= 0) return 0;
  if (s === t) return 0;

  // 邻接表残量图
  const g: Arc[][] = Array.from({ length: n }, () => []);
  const addEdge = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
  };
  for (const e of edges) {
    if (e.cap > 0) addEdge(e.from, e.to, e.cap);
  }

  let maxFlow = 0;

  // BFS 找最短增广路，返回路径上每条弧的 (节点, 弧下标)
  const bfs = (): Array<{ node: number; arcIdx: number }> | null => {
    const prevArc = new Array<{ node: number; arcIdx: number } | null>(n).fill(null);
    const seen = new Array<boolean>(n).fill(false);
    seen[s] = true;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      if (u === t) break;
      const arcs = g[u]!;
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i]!;
        if (a.cap > 0 && !seen[a.to]) {
          seen[a.to] = true;
          prevArc[a.to] = { node: u, arcIdx: i };
          queue.push(a.to);
        }
      }
    }
    if (!seen[t]) return null;
    // 回溯路径
    const hops: Array<{ node: number; arcIdx: number }> = [];
    let cur = t;
    while (cur !== s) {
      const p = prevArc[cur];
      if (!p) return null;
      hops.push(p);
      cur = p.node;
    }
    hops.reverse();
    return hops;
  };

  for (;;) {
    const hops = bfs();
    if (!hops) {
      hooks.onNoPath?.(maxFlow);
      break;
    }
    // 求瓶颈
    let bottleneck = Infinity;
    for (const h of hops) {
      const arc = g[h.node]![h.arcIdx]!;
      if (arc.cap < bottleneck) bottleneck = arc.cap;
    }
    // 推进流量
    for (const h of hops) {
      const arc = g[h.node]![h.arcIdx]!;
      arc.cap -= bottleneck;
      g[arc.to]![arc.rev]!.cap += bottleneck;
    }
    maxFlow += bottleneck;
    // 构造节点路径供钩子
    const path: number[] = [s, ...hops.map((h) => g[h.node]![h.arcIdx]!.to)];
    hooks.onAugment?.(path, bottleneck, maxFlow);
  }

  return maxFlow;
}
