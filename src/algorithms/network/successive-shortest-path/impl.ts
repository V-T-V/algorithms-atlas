// =============================================================================
// 逐次最短增广路（SSP）最小费用流 · 纯算法实现
// 用 SPFA 初始化势能，Dijkstra（reduced cost）迭代增广。
// =============================================================================

export interface SspEdgeInput {
  from: number;
  to: number;
  cap: number;
  cost: number;
}

export interface SspResult {
  maxFlow: number;
  minCost: number;
}

export interface SspHooks {
  onAugment?: (
    path: number[],
    flow: number,
    pathCost: number,
    totalFlow: number,
    totalCost: number,
  ) => void;
  onDone?: (result: SspResult) => void;
}

interface Arc {
  to: number;
  cap: number;
  cost: number;
  rev: number;
}

export function successiveShortestPath(
  n: number,
  edges: readonly SspEdgeInput[],
  s: number,
  t: number,
  hooks: SspHooks = {},
): SspResult {
  if (n <= 0 || s === t) {
    const r: SspResult = { maxFlow: 0, minCost: 0 };
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

  // 初始势能用 SPFA（Bellman-Ford 队列优化）求（容许负费用边）
  const pot = new Array<number>(n).fill(0);
  const initPot = (): void => {
    pot.fill(0);
    // SPFA
    const inQueue = new Array<boolean>(n).fill(false);
    const queue: number[] = [s];
    inQueue[s] = true;
    pot[s] = 0;
    while (queue.length > 0) {
      const u = queue.shift()!;
      inQueue[u] = false;
      for (const a of g[u]!) {
        if (a.cap > 0 && pot[u]! + a.cost < pot[a.to]!) {
          pot[a.to] = pot[u]! + a.cost;
          if (!inQueue[a.to]) {
            inQueue[a.to] = true;
            queue.push(a.to);
          }
        }
      }
    }
  };
  initPot();

  let totalFlow = 0;
  let totalCost = 0;
  const dist = new Array<number>(n).fill(0);
  const parent = new Array<number>(n).fill(-1);
  const parentArc = new Array<number>(n).fill(-1);

  const dijkstra = (): boolean => {
    dist.fill(Infinity);
    parent.fill(-1);
    parentArc.fill(-1);
    dist[s] = 0;
    // 简单优先队列（数组）
    const visited = new Array<boolean>(n).fill(false);
    for (let iter = 0; iter < n; iter++) {
      let u = -1;
      let best = Infinity;
      for (let i = 0; i < n; i++) {
        if (!visited[i] && dist[i]! < best) {
          best = dist[i]!;
          u = i;
        }
      }
      if (u === -1 || best === Infinity) break;
      visited[u] = true;
      const arcs = g[u]!;
      for (let k = 0; k < arcs.length; k++) {
        const a = arcs[k]!;
        if (a.cap > 0) {
          const reduced = a.cost + pot[u]! - pot[a.to]!;
          if (dist[u]! + reduced < dist[a.to]!) {
            dist[a.to] = dist[u]! + reduced;
            parent[a.to] = u;
            parentArc[a.to] = k;
          }
        }
      }
    }
    return dist[t]! < Infinity;
  };

  while (dijkstra()) {
    // 求瓶颈
    let bottleneck = Infinity;
    const pathNodes: number[] = [];
    let cur = t;
    while (cur !== s) {
      pathNodes.push(cur);
      const p = parent[cur]!;
      const arc = g[p]![parentArc[cur]!]!;
      if (arc.cap < bottleneck) bottleneck = arc.cap;
      cur = p;
    }
    pathNodes.push(s);
    pathNodes.reverse();

    // 实际路径费用 = 用 reduced cost 反推
    // realCost(v) = dist[v] - pot[s] + pot[v]
    const pathRealCost = dist[t]! - pot[s]! + pot[t]!;
    totalFlow += bottleneck;
    totalCost += bottleneck * pathRealCost;
    hooks.onAugment?.(pathNodes, bottleneck, pathRealCost, totalFlow, totalCost);

    // 推进
    cur = t;
    while (cur !== s) {
      const p = parent[cur]!;
      const arc = g[p]![parentArc[cur]!]!;
      arc.cap -= bottleneck;
      g[cur]![arc.rev]!.cap += bottleneck;
      cur = p;
    }

    // 更新势能
    for (let i = 0; i < n; i++) {
      if (dist[i]! < Infinity) pot[i] = pot[i]! + dist[i]!;
    }
  }

  const r: SspResult = { maxFlow: totalFlow, minCost: totalCost };
  hooks.onDone?.(r);
  return r;
}
