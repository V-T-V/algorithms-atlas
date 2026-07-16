// 含负费用边的最小费用流 · 实现

export interface NegCostEdge {
  from: number;
  to: number;
  cap: number;
  cost: number;
}

export interface NegCostResult {
  maxFlow: number;
  minCost: number;
}

interface Arc {
  to: number;
  cap: number;
  cost: number;
  rev: number;
}

/** Bellman-Ford 求势能 h（从源点 0 出发的最短距离）。若无负圈返回 h，否则返回 null。 */
function bellmanFord(n: number, graph: Arc[][]): number[] | null {
  const h = new Array<number>(n).fill(0);
  for (let k = 0; k < n; k++) {
    let updated = false;
    for (let u = 0; u < n; u++) {
      for (const a of graph[u]!) {
        if (a.cap > 0 && h[u]! + a.cost < h[a.to]!) {
          h[a.to] = h[u]! + a.cost;
          updated = true;
        }
      }
    }
    if (!updated) break;
  }
  // 检查负圈
  for (let u = 0; u < n; u++) {
    for (const a of graph[u]!) {
      if (a.cap > 0 && h[u]! + a.cost < h[a.to]!) return null;
    }
  }
  return h;
}

/** 用势能 + Dijkstra 找最短增广路。 */
function dijkstra(
  n: number,
  graph: Arc[][],
  h: number[],
  s: number,
  _t: number,
): { dist: number[]; prevNode: number[]; prevArc: number[] } {
  const dist = new Array<number>(n).fill(Infinity);
  const prevNode = new Array<number>(n).fill(-1);
  const prevArc = new Array<number>(n).fill(-1);
  dist[s] = 0;
  const visited = new Array<boolean>(n).fill(false);
  for (let _ = 0; _ < n; _++) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!visited[i] && dist[i]! < best) {
        best = dist[i]!;
        u = i;
      }
    }
    if (u < 0) break;
    visited[u] = true;
    for (let i = 0; i < graph[u]!.length; i++) {
      const a = graph[u]![i]!;
      if (a.cap > 0) {
        const reduced = a.cost + h[u]! - h[a.to]!;
        if (dist[u]! + reduced < dist[a.to]!) {
          dist[a.to] = dist[u]! + reduced;
          prevNode[a.to] = u;
          prevArc[a.to] = i;
        }
      }
    }
  }
  return { dist, prevNode, prevArc };
}

/** 含负费用边的最小费用最大流（势能 + Dijkstra）。 */
export function minCostNegativeEdges(
  n: number,
  edges: ReadonlyArray<NegCostEdge>,
  s: number,
  t: number,
): NegCostResult {
  if (n <= 0 || s === t) return { maxFlow: 0, minCost: 0 };
  const graph: Arc[][] = Array.from({ length: n }, () => []);
  const addEdge = (u: number, v: number, cap: number, cost: number): void => {
    graph[u]!.push({ to: v, cap, cost, rev: graph[v]!.length });
    graph[v]!.push({ to: u, cap: 0, cost: -cost, rev: graph[u]!.length - 1 });
  };
  for (const e of edges) if (e.cap > 0) addEdge(e.from, e.to, e.cap, e.cost);

  let h = bellmanFord(n, graph);
  if (!h) h = new Array<number>(n).fill(0); // 有负圈时退化（不应发生）

  let maxFlow = 0;
  let minCost = 0;
  for (;;) {
    const { dist, prevNode, prevArc } = dijkstra(n, graph, h, s, t);
    if (dist[t] === Infinity) break;
    // 更新势能
    for (let v = 0; v < n; v++) {
      if (dist[v]! < Infinity) h[v] = h[v]! + dist[v]!;
    }
    // 找瓶颈
    let bottleneck = Infinity;
    let cur = t;
    while (cur !== s) {
      const p = prevNode[cur]!;
      const ai = prevArc[cur]!;
      bottleneck = Math.min(bottleneck, graph[p]![ai]!.cap);
      cur = p;
    }
    // 推送
    cur = t;
    while (cur !== s) {
      const p = prevNode[cur]!;
      const ai = prevArc[cur]!;
      const arc = graph[p]![ai]!;
      arc.cap -= bottleneck;
      graph[arc.to]![arc.rev]!.cap += bottleneck;
      minCost += bottleneck * arc.cost;
      cur = p;
    }
    maxFlow += bottleneck;
  }
  return { maxFlow, minCost };
}
