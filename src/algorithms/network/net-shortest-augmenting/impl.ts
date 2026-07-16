// 最短增广路 · 实现

export interface SapEdge {
  from: string;
  to: string;
  cap: number;
}

export interface SapHooks {
  onAugment?: (path: string[], bottleneck: number, totalFlow: number, pathLen: number) => void;
  onDone?: (maxFlow: number, rounds: number) => void;
}

interface ResArc {
  to: string;
  cap: number;
}

/** BFS 找最短增广路。 */
function bfsShortestPath(
  graph: Map<string, ResArc[]>,
  source: string,
  sink: string,
): { path: string[]; bottleneck: number } | null {
  const prev = new Map<string, string>([[source, '']]);
  const queue: string[] = [source];
  while (queue.length > 0) {
    const u = queue.shift()!;
    if (u === sink) break;
    for (const a of graph.get(u) ?? []) {
      if (a.cap > 0 && !prev.has(a.to)) {
        prev.set(a.to, u);
        queue.push(a.to);
      }
    }
  }
  if (!prev.has(sink)) return null;
  const path: string[] = [];
  let cur: string = sink;
  let bottleneck = Infinity;
  while (cur !== '') {
    path.push(cur);
    const p = prev.get(cur)!;
    if (p !== '') {
      const arc = graph.get(p)!.find((a) => a.to === cur && a.cap > 0);
      if (arc) bottleneck = Math.min(bottleneck, arc.cap);
    }
    cur = p;
  }
  path.reverse();
  return { path, bottleneck };
}

/** 最短增广路（Edmonds-Karp）求最大流。 */
export function shortestAugmentingPath(
  nodes: readonly string[],
  edges: ReadonlyArray<SapEdge>,
  source: string,
  sink: string,
  hooks: SapHooks = {},
): number {
  const graph = new Map<string, ResArc[]>();
  for (const n of nodes) graph.set(n, []);
  for (const e of edges) {
    if (e.cap > 0) graph.get(e.from)!.push({ to: e.to, cap: e.cap });
  }
  // 反向边初始容量 0（合并同方向）
  for (const e of edges) {
    if (e.cap > 0) {
      const rev = graph.get(e.to)!.find((a) => a.to === e.from);
      if (!rev) graph.get(e.to)!.push({ to: e.from, cap: 0 });
    }
  }

  let maxFlow = 0;
  let rounds = 0;
  for (;;) {
    const found = bfsShortestPath(graph, source, sink);
    if (!found) break;
    rounds++;
    const { path, bottleneck } = found;
    for (let i = 0; i + 1 < path.length; i++) {
      const u = path[i]!;
      const v = path[i + 1]!;
      const arc = graph.get(u)!.find((a) => a.to === v && a.cap > 0);
      if (arc) arc.cap -= bottleneck;
      const rev = graph.get(v)!.find((a) => a.to === u);
      if (rev) rev.cap += bottleneck;
      else graph.get(v)!.push({ to: u, cap: bottleneck });
    }
    maxFlow += bottleneck;
    hooks.onAugment?.(path, bottleneck, maxFlow, path.length - 1);
  }
  hooks.onDone?.(maxFlow, rounds);
  return maxFlow;
}
