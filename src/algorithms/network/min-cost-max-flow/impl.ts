// =============================================================================
// 最小费用最大流（Min-Cost Max-Flow）· 纯算法实现
// SPFA 找费用最短增广路逐次增广。零 DOM 依赖，可独立单测。
// 节点用 0..n-1 的整数下标表示。
// =============================================================================

export interface McmfEdgeInput {
  from: number;
  to: number;
  cap: number;
  /** 单位流量费用（可为负数）。 */
  cost: number;
}

export interface McmfResult {
  maxFlow: number;
  minCost: number;
}

/** 事件钩子。 */
export interface McmfHooks {
  /** 一次 SPFA 找到增广路 path（节点序列），瓶颈 flow，路径单位总费用 pathCost，当前累计流量/费用。 */
  onAugment?: (
    path: number[],
    flow: number,
    pathCost: number,
    totalFlow: number,
    totalCost: number,
  ) => void;
  /** 算法结束。 */
  onDone?: (result: McmfResult) => void;
}

interface Arc {
  to: number;
  cap: number;
  cost: number;
  rev: number;
}

/**
 * 最小费用最大流（SPFA 增广）。
 *
 * @param n 节点数（0..n-1）
 * @param edges 边 {from, to, cap, cost}
 * @param s 源
 * @param t 汇
 * @param hooks 可选钩子
 * @returns {maxFlow, minCost}
 */
export function minCostMaxFlow(
  n: number,
  edges: readonly McmfEdgeInput[],
  s: number,
  t: number,
  hooks: McmfHooks = {},
): McmfResult {
  if (n <= 0 || s === t) {
    const r: McmfResult = { maxFlow: 0, minCost: 0 };
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

  let totalFlow = 0;
  let totalCost = 0;
  const dist = new Array<number>(n).fill(0);
  const inQueue = new Array<boolean>(n).fill(false);
  const parentArc = new Array<number>(n).fill(-1);
  const parentNode = new Array<number>(n).fill(-1);

  // SPFA 找 s→t 的费用最短路（在残量网络上）
  const spfa = (): boolean => {
    dist.fill(Infinity);
    inQueue.fill(false);
    dist[s] = 0;
    const queue: number[] = [s];
    let head = 0;
    inQueue[s] = true;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      inQueue[u] = false;
      const arcs = g[u]!;
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i]!;
        if (a.cap > 0 && dist[u]! + a.cost < dist[a.to]!) {
          dist[a.to] = dist[u]! + a.cost;
          parentArc[a.to] = i;
          parentNode[a.to] = u;
          if (!inQueue[a.to]!) {
            inQueue[a.to] = true;
            queue.push(a.to);
          }
        }
      }
    }
    return dist[t]! < Infinity;
  };

  while (spfa()) {
    // 求瓶颈
    let bottleneck = Infinity;
    const pathNodes: number[] = [];
    let cur = t;
    while (cur !== s) {
      pathNodes.push(cur);
      const p = parentNode[cur]!;
      const arc = g[p]![parentArc[cur]!]!;
      if (arc.cap < bottleneck) bottleneck = arc.cap;
      cur = p;
    }
    pathNodes.push(s);
    pathNodes.reverse();

    const pathCost = dist[t]!;
    totalFlow += bottleneck;
    totalCost += bottleneck * pathCost;
    hooks.onAugment?.(pathNodes, bottleneck, pathCost, totalFlow, totalCost);

    // 沿路更新残量
    cur = t;
    while (cur !== s) {
      const p = parentNode[cur]!;
      const arc = g[p]![parentArc[cur]!]!;
      arc.cap -= bottleneck;
      g[cur]![arc.rev]!.cap += bottleneck;
      cur = p;
    }
  }

  const r: McmfResult = { maxFlow: totalFlow, minCost: totalCost };
  hooks.onDone?.(r);
  return r;
}
