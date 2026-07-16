// =============================================================================
// 容量缩放 Dinic · 纯算法实现
// Dinic + 容量缩放：每轮只走残量 ≥ Δ 的边，Δ 逐轮减半。
// =============================================================================

export interface DsEdgeInput {
  from: number;
  to: number;
  cap: number;
}

export interface DsHooks {
  onScale?: (delta: number) => void;
  onAugment?: (path: number[], flow: number, totalFlow: number) => void;
  onPhase?: (phase: number, phaseFlow: number, totalFlow: number) => void;
  onDone?: (totalFlow: number) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

/**
 * 容量缩放 Dinic。
 *
 * @param n 节点数（0..n-1）
 * @param edges 边
 * @param s 源
 * @param t 汇
 * @param hooks 钩子
 * @returns 最大流值
 */
export function dinicScaling(
  n: number,
  edges: readonly DsEdgeInput[],
  s: number,
  t: number,
  hooks: DsHooks = {},
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
  let maxCap = 0;
  for (const e of edges) {
    if (e.cap > 0) {
      addEdge(e.from, e.to, e.cap);
      if (e.cap > maxCap) maxCap = e.cap;
    }
  }

  const level = new Array<number>(n).fill(-1);
  const cur = new Array<number>(n).fill(0);
  let delta = 1;
  while (delta * 2 <= maxCap) delta *= 2;

  // BFS 分层（只走残量 ≥ delta 的边）
  const bfs = (d: number): boolean => {
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
        if (a.cap >= d && level[a.to]! < 0) {
          level[a.to] = level[u]! + 1;
          queue.push(a.to);
        }
      }
    }
    return level[t]! >= 0;
  };

  // DFS（带当前弧，只走 cap ≥ delta 的边）
  const dfs = (u: number, pushed: number, d: number): number => {
    if (u === t) return pushed;
    const arcs = g[u]!;
    for (; cur[u]! < arcs.length; cur[u] = cur[u]! + 1) {
      const i = cur[u]!;
      const a = arcs[i]!;
      if (a.cap >= d && level[a.to] === level[u]! + 1) {
        const tr = dfs(a.to, Math.min(pushed, a.cap), d);
        if (tr > 0) {
          a.cap -= tr;
          g[a.to]![a.rev]!.cap += tr;
          return tr;
        }
      }
    }
    return 0;
  };

  let maxFlow = 0;
  for (let d = delta; d >= 1; d = Math.floor(d / 2)) {
    hooks.onScale?.(d);
    while (bfs(d)) {
      cur.fill(0);
      let phaseFlow = 0;
      let phase = 0;
      for (;;) {
        const f = dfs(s, Infinity, d);
        if (f === 0) break;
        phaseFlow += f;
        maxFlow += f;
        // 重建 dfs 路径用于 hook
        hooks.onAugment?.([], f, maxFlow);
      }
      phase += 1;
      hooks.onPhase?.(phase, phaseFlow, maxFlow);
    }
  }

  hooks.onDone?.(maxFlow);
  return maxFlow;
}

/** 带路径记录的版本（用于 trace）。 */
export function dinicScalingWithPaths(
  n: number,
  edges: readonly DsEdgeInput[],
  s: number,
  t: number,
  hooks: DsHooks = {},
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
  let maxCap = 0;
  for (const e of edges) {
    if (e.cap > 0) {
      addEdge(e.from, e.to, e.cap);
      if (e.cap > maxCap) maxCap = e.cap;
    }
  }

  const level = new Array<number>(n).fill(-1);
  const cur = new Array<number>(n).fill(0);
  let delta = 1;
  while (delta * 2 <= maxCap) delta *= 2;

  const bfs = (d: number): boolean => {
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
        if (a.cap >= d && level[a.to]! < 0) {
          level[a.to] = level[u]! + 1;
          queue.push(a.to);
        }
      }
    }
    return level[t]! >= 0;
  };

  // DFS 带路径记录
  const dfsPath = (d: number): { path: number[]; flow: number } | null => {
    const pathNode: number[] = [s];
    const pathArc: number[] = [];
    let u = s;
    let guard = 0;
    const limit = n * (n + 2);
    while (u !== t && guard++ < limit) {
      const arcs = g[u]!;
      let advanced = false;
      while (cur[u]! < arcs.length) {
        const i = cur[u]!;
        const a = arcs[i]!;
        if (a.cap >= d && level[a.to] === level[u]! + 1) {
          pathArc.push(i);
          pathNode.push(a.to);
          u = a.to;
          advanced = true;
          break;
        }
        cur[u] = cur[u]! + 1;
      }
      if (advanced) continue;
      if (pathNode.length <= 1) return null;
      pathNode.pop();
      pathArc.pop();
      const prev = pathNode[pathNode.length - 1]!;
      cur[prev] = cur[prev]! + 1;
      u = prev;
    }
    if (u !== t) return null;
    let bottleneck = Infinity;
    for (let k = 0; k < pathArc.length; k++) {
      const node = pathNode[k]!;
      const arc = g[node]![pathArc[k]!]!;
      if (arc.cap < bottleneck) bottleneck = arc.cap;
    }
    for (let k = 0; k < pathArc.length; k++) {
      const node = pathNode[k]!;
      const arc = g[node]![pathArc[k]!]!;
      arc.cap -= bottleneck;
      g[arc.to]![arc.rev]!.cap += bottleneck;
    }
    return { path: pathNode, flow: bottleneck };
  };

  let maxFlow = 0;
  for (let d = delta; d >= 1; d = Math.floor(d / 2)) {
    hooks.onScale?.(d);
    while (bfs(d)) {
      cur.fill(0);
      let phaseFlow = 0;
      let phase = 0;
      for (;;) {
        const found = dfsPath(d);
        if (!found) break;
        phaseFlow += found.flow;
        maxFlow += found.flow;
        hooks.onAugment?.(found.path, found.flow, maxFlow);
      }
      phase += 1;
      hooks.onPhase?.(phase, phaseFlow, maxFlow);
    }
  }

  hooks.onDone?.(maxFlow);
  return maxFlow;
}
