// =============================================================================
// 消负环最小费用流 · 纯算法实现
// 阶段 1：Edmonds-Karp 求最大流
// 阶段 2：Bellman-Ford 找残量网络负费用环，反复消除
// =============================================================================

export interface CcEdgeInput {
  from: number;
  to: number;
  cap: number;
  cost: number;
}

export interface CcResult {
  maxFlow: number;
  minCost: number;
}

export interface CcHooks {
  onMaxFlowFound?: (maxFlow: number, initialCost: number) => void;
  onNegativeCycle?: (
    cycle: number[],
    cycleCost: number,
    pushed: number,
    totalCostAfter: number,
  ) => void;
  onDone?: (result: CcResult) => void;
}

interface Arc {
  to: number;
  cap: number;
  cost: number;
  rev: number;
}

export function cycleCancel(
  n: number,
  edges: readonly CcEdgeInput[],
  s: number,
  t: number,
  hooks: CcHooks = {},
): CcResult {
  if (n <= 0 || s === t) {
    const r: CcResult = { maxFlow: 0, minCost: 0 };
    hooks.onDone?.(r);
    return r;
  }

  const g: Arc[][] = Array.from({ length: n }, () => []);
  const addEdge = (u: number, v: number, cap: number, cost: number): void => {
    g[u]!.push({ to: v, cap, cost, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, cost: -cost, rev: g[u]!.length - 1 });
  };
  for (const e of edges) {
    if (e.cap > 0) addEdge(e.from, e.to, e.cap, e.cost);
  }

  // —— 阶段 1：BFS 找增广路求最大流（Edmonds-Karp 风格，不考虑费用）——
  let maxFlow = 0;
  let totalCost = 0;
  const bfsAugment = (): number[] | null => {
    const parent = new Array<number>(n).fill(-1);
    const parentArc = new Array<number>(n).fill(-1);
    const visited = new Array<boolean>(n).fill(false);
    visited[s] = true;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      const arcs = g[u]!;
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i]!;
        if (a.cap > 0 && !visited[a.to]) {
          visited[a.to] = true;
          parent[a.to] = u;
          parentArc[a.to] = i;
          if (a.to === t) {
            // 重建路径
            const path: number[] = [];
            let cur = t;
            while (cur !== s) {
              path.unshift(cur);
              cur = parent[cur]!;
            }
            path.unshift(s);
            return path;
          }
          queue.push(a.to);
        }
      }
    }
    return null;
  };

  for (;;) {
    const path = bfsAugment();
    if (!path) break;
    // 求瓶颈 + 计算路径费用
    let bottleneck = Infinity;
    let pathCost = 0;
    for (let i = 0; i + 1 < path.length; i++) {
      const u = path[i]!;
      const v = path[i + 1]!;
      // 找 u→v 的弧
      for (let k = 0; k < g[u]!.length; k++) {
        const a = g[u]![k]!;
        if (a.to === v && a.cap > 0) {
          if (a.cap < bottleneck) bottleneck = a.cap;
          pathCost += a.cost;
          break;
        }
      }
    }
    // 推进
    for (let i = 0; i + 1 < path.length; i++) {
      const u = path[i]!;
      const v = path[i + 1]!;
      for (let k = 0; k < g[u]!.length; k++) {
        const a = g[u]![k]!;
        if (a.to === v && a.cap > 0) {
          a.cap -= bottleneck;
          g[v]![a.rev]!.cap += bottleneck;
          break;
        }
      }
    }
    maxFlow += bottleneck;
    totalCost += bottleneck * pathCost;
  }

  hooks.onMaxFlowFound?.(maxFlow, totalCost);

  // —— 阶段 2：消负环（Bellman-Ford）——
  const dist = new Array<number>(n).fill(0);
  const parent = new Array<number>(n).fill(-1);
  const parentArc = new Array<number>(n).fill(-1);

  const findNegativeCycle = (): number[] | null => {
    dist.fill(0);
    parent.fill(-1);
    parentArc.fill(-1);
    let x = -1;
    for (let iter = 0; iter < n; iter++) {
      x = -1;
      for (let u = 0; u < n; u++) {
        const arcs = g[u]!;
        for (let k = 0; k < arcs.length; k++) {
          const a = arcs[k]!;
          if (a.cap > 0 && dist[u]! + a.cost < dist[a.to]!) {
            dist[a.to] = dist[u]! + a.cost;
            parent[a.to] = u;
            parentArc[a.to] = k;
            x = a.to;
          }
        }
      }
    }
    if (x === -1) return null;
    // 回到环中
    for (let i = 0; i < n; i++) x = parent[x]!;
    // 提取环
    const cycle: number[] = [];
    let cur = x;
    do {
      cycle.unshift(cur);
      cur = parent[cur]!;
    } while (cur !== x && cur !== -1);
    cycle.unshift(cur);
    return cycle;
  };

  for (;;) {
    const cycle = findNegativeCycle();
    if (!cycle) break;
    // 计算环上瓶颈 + 总费用
    let bottleneck = Infinity;
    let cycleCost = 0;
    for (let i = 0; i < cycle.length; i++) {
      const u = cycle[i]!;
      const v = cycle[(i + 1) % cycle.length]!;
      for (let k = 0; k < g[u]!.length; k++) {
        const a = g[u]![k]!;
        if (a.to === v && a.cap > 0) {
          if (a.cap < bottleneck) bottleneck = a.cap;
          cycleCost += a.cost;
          break;
        }
      }
    }
    if (bottleneck === Infinity || cycleCost >= 0) break;
    // 推进
    for (let i = 0; i < cycle.length; i++) {
      const u = cycle[i]!;
      const v = cycle[(i + 1) % cycle.length]!;
      for (let k = 0; k < g[u]!.length; k++) {
        const a = g[u]![k]!;
        if (a.to === v && a.cap > 0) {
          a.cap -= bottleneck;
          g[v]![a.rev]!.cap += bottleneck;
          break;
        }
      }
    }
    totalCost += bottleneck * cycleCost;
    hooks.onNegativeCycle?.(cycle, cycleCost, bottleneck, totalCost);
  }

  const r: CcResult = { maxFlow, minCost: totalCost };
  hooks.onDone?.(r);
  return r;
}
