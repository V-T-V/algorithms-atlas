// =============================================================================
// 网络单纯形 · 纯算法实现（简化版）
// 用「负费用环消除」等价的循环：每次找一条 reduced cost < 0 的非树边，
// 加入形成环，沿环消除正费用边。本实现以 cycle-canceling 风格作为简化模型。
// =============================================================================

export interface NsEdgeInput {
  from: number;
  to: number;
  cap: number;
  cost: number;
  /** 该边的需求流量（下界）；默认 0。 */
  lower?: number;
}

export interface NsResult {
  maxFlow: number;
  minCost: number;
}

export interface NsHooks {
  onTree?: (treeEdges: Array<{ from: number; to: number }>, potentials: number[]) => void;
  onPivot?: (
    enterEdge: { from: number; to: number },
    leaveEdge: { from: number; to: number },
    reducedCost: number,
  ) => void;
  onDone?: (result: NsResult) => void;
}

interface Arc {
  from: number;
  to: number;
  cap: number;
  cost: number;
  rev: number;
  /** 在原始边列表中的索引（用于回溯）。 */
  origIdx: number;
}

/**
 * 网络单纯形（简化实现）。
 * 用「找负费用环消除」模拟单纯形的 pivot 操作，每次消除记录一个 pivot 事件。
 */
export function networkSimplex(
  n: number,
  edges: readonly NsEdgeInput[],
  s: number,
  t: number,
  hooks: NsHooks = {},
): NsResult {
  if (n <= 0 || s === t) {
    const r: NsResult = { maxFlow: 0, minCost: 0 };
    hooks.onDone?.(r);
    return r;
  }

  const g: Arc[][] = Array.from({ length: n }, () => []);
  const addEdge = (u: number, v: number, cap: number, cost: number, origIdx: number): void => {
    g[u]!.push({ from: u, to: v, cap, cost, rev: g[v]!.length, origIdx });
    g[v]!.push({ from: v, to: u, cap: 0, cost: -cost, rev: g[u]!.length - 1, origIdx });
  };
  edges.forEach((e, i) => {
    if (e.cap > 0) addEdge(e.from, e.to, e.cap, e.cost, i);
  });

  // 阶段 1：BFS 求最大流（任意）
  let maxFlow = 0;
  let totalCost = 0;
  const bfsAugment = (): number[] | null => {
    const parent = new Array<number>(n).fill(-1);
    const visited = new Array<boolean>(n).fill(false);
    visited[s] = true;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      for (const a of g[u]!) {
        if (a.cap > 0 && !visited[a.to]) {
          visited[a.to] = true;
          parent[a.to] = u;
          if (a.to === t) {
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
    let bottleneck = Infinity;
    let pathCost = 0;
    for (let i = 0; i + 1 < path.length; i++) {
      const u = path[i]!;
      const v = path[i + 1]!;
      for (const a of g[u]!) {
        if (a.to === v && a.cap > 0) {
          if (a.cap < bottleneck) bottleneck = a.cap;
          pathCost += a.cost;
          break;
        }
      }
    }
    for (let i = 0; i + 1 < path.length; i++) {
      const u = path[i]!;
      const v = path[i + 1]!;
      for (const a of g[u]!) {
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

  // 阶段 2：用 Bellman-Ford 找负环（模拟 pivot）
  const dist = new Array<number>(n).fill(0);
  const parent = new Array<number>(n).fill(-1);
  const parentArc = new Array<number>(n).fill(-1);
  let pivotCount = 0;
  const maxPivots = n * n + 10;

  const findNegativeCycle = (): number[] | null => {
    dist.fill(0);
    parent.fill(-1);
    parentArc.fill(-1);
    let x = -1;
    for (let iter = 0; iter < n; iter++) {
      x = -1;
      for (let u = 0; u < n; u++) {
        for (let k = 0; k < g[u]!.length; k++) {
          const a = g[u]![k]!;
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
    for (let i = 0; i < n; i++) x = parent[x]!;
    const cycle: number[] = [];
    let cur = x;
    do {
      cycle.unshift(cur);
      cur = parent[cur]!;
    } while (cur !== x && cur !== -1);
    cycle.unshift(cur);
    return cycle;
  };

  while (pivotCount < maxPivots) {
    const cycle = findNegativeCycle();
    if (!cycle) break;
    let bottleneck = Infinity;
    let cycleCost = 0;
    let leaveArc: Arc | null = null;
    for (let i = 0; i < cycle.length; i++) {
      const u = cycle[i]!;
      const v = cycle[(i + 1) % cycle.length]!;
      for (const a of g[u]!) {
        if (a.to === v && a.cap > 0) {
          if (a.cap < bottleneck) {
            bottleneck = a.cap;
            leaveArc = a;
          }
          cycleCost += a.cost;
          break;
        }
      }
    }
    if (bottleneck === Infinity || cycleCost >= 0 || !leaveArc) break;
    // 推进
    for (let i = 0; i < cycle.length; i++) {
      const u = cycle[i]!;
      const v = cycle[(i + 1) % cycle.length]!;
      for (const a of g[u]!) {
        if (a.to === v && a.cap > 0) {
          a.cap -= bottleneck;
          g[v]![a.rev]!.cap += bottleneck;
          break;
        }
      }
    }
    totalCost += bottleneck * cycleCost;
    pivotCount += 1;
    hooks.onPivot?.(
      { from: cycle[0]!, to: cycle[1]! },
      { from: leaveArc.from, to: leaveArc.to },
      cycleCost,
    );
    // 报告一次势能（用 dist 近似）
    hooks.onTree?.(
      cycle.map((c, i) => ({ from: c, to: cycle[(i + 1) % cycle.length]! })),
      [...dist],
    );
  }

  const r: NsResult = { maxFlow, minCost: totalCost };
  hooks.onDone?.(r);
  return r;
}
