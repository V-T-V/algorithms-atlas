// =============================================================================
// Dinic 最大流 · 纯算法实现
// 分层网络 + DFS 阻塞流（带当前弧优化）。零 DOM 依赖，可独立单测。
// 节点用 0..n-1 的整数下标表示。
// =============================================================================

export interface DinicEdgeInput {
  from: number;
  to: number;
  cap: number;
}

/** 事件钩子。 */
export interface DinicHooks {
  /** 一次 BFS 分层完成，给出汇点是否可达 reachable。 */
  onLevel?: (level: number[], reachable: boolean) => void;
  /** DFS 找到一条增广路 path（节点序列），瓶颈 flow，更新后总流量。 */
  onAugment?: (path: number[], flow: number, totalFlow: number) => void;
  /** 一个阶段的阻塞流结束（本阶段共推进 phaseFlow）。 */
  onPhase?: (phase: number, phaseFlow: number, totalFlow: number) => void;
  /** 算法结束。 */
  onDone?: (totalFlow: number) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

/**
 * Dinic 最大流。
 *
 * @param n 节点数（0..n-1）
 * @param edges 边 {from, to, cap}
 * @param s 源
 * @param t 汇
 * @param hooks 可选钩子
 * @returns 最大流值
 */
export function dinic(
  n: number,
  edges: readonly DinicEdgeInput[],
  s: number,
  t: number,
  hooks: DinicHooks = {},
): number {
  if (n <= 0 || s === t) {
    hooks.onDone?.(0);
    return 0;
  }

  const g: Arc[][] = Array.from({ length: n }, () => []);
  const addEdge = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
  };
  for (const e of edges) {
    if (e.cap > 0) addEdge(e.from, e.to, e.cap);
  }

  const level = new Array<number>(n).fill(-1);
  const cur = new Array<number>(n).fill(0);

  // BFS 分层；返回 t 是否可达
  const bfs = (): boolean => {
    level.fill(-1);
    level[s] = 0;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      const arcs = g[u]!;
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i]!;
        if (a.cap > 0 && level[a.to]! < 0) {
          level[a.to] = level[u]! + 1;
          queue.push(a.to);
        }
      }
    }
    const reachable = level[t]! >= 0;
    hooks.onLevel?.([...level], reachable);
    return reachable;
  };

  // 带路径记录的单路 DFS：在分层网络中找一条 s→t 路，推进其瓶颈，返回
  // {path, flow}；找不到返回 null。使用 cur[] 当前弧优化。
  const dfsOnePath = (): { path: number[]; flow: number } | null => {
    const pathNode: number[] = [s];
    const pathArc: number[] = [];
    let u = s;
    // 回溯上限：避免极端情况下死循环
    let guard = 0;
    const limit = n * (n + 2);
    while (u !== t && guard++ < limit) {
      const arcs = g[u]!;
      let advanced = false;
      while (cur[u]! < arcs.length) {
        const i = cur[u]!;
        const a = arcs[i]!;
        if (a.cap > 0 && level[a.to] === level[u]! + 1) {
          pathArc.push(i);
          pathNode.push(a.to);
          u = a.to;
          advanced = true;
          break;
        }
        cur[u] = cur[u]! + 1; // 该弧在分层网络中不可用，推进当前弧
      }
      if (advanced) continue;
      // 未前进：回溯
      if (pathNode.length <= 1) return null;
      pathNode.pop();
      pathArc.pop();
      const prev = pathNode[pathNode.length - 1]!;
      cur[prev] = cur[prev]! + 1; // 标记刚才那条弧已用尽
      u = prev;
    }
    if (u !== t) return null;
    // 求瓶颈
    let bottleneck = Infinity;
    for (let k = 0; k < pathArc.length; k++) {
      const node = pathNode[k]!;
      const arc = g[node]![pathArc[k]!]!;
      if (arc.cap < bottleneck) bottleneck = arc.cap;
    }
    // 沿路推进（更新残量）
    for (let k = 0; k < pathArc.length; k++) {
      const node = pathNode[k]!;
      const arc = g[node]![pathArc[k]!]!;
      arc.cap -= bottleneck;
      g[arc.to]![arc.rev]!.cap += bottleneck;
    }
    return { path: pathNode, flow: bottleneck };
  };

  let maxFlow = 0;
  let phase = 0;

  while (bfs()) {
    phase++;
    cur.fill(0);
    let phaseFlow = 0;
    for (;;) {
      const found = dfsOnePath();
      if (!found) break;
      phaseFlow += found.flow;
      maxFlow += found.flow;
      hooks.onAugment?.(found.path, found.flow, maxFlow);
    }
    hooks.onPhase?.(phase, phaseFlow, maxFlow);
  }

  hooks.onDone?.(maxFlow);
  return maxFlow;
}
