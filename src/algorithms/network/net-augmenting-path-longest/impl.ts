// 最大瓶颈增广路 · 实现

export interface WidestEdge {
  from: string;
  to: string;
  cap: number;
}

export interface WidestHooks {
  onAugment?: (path: string[], bottleneck: number, totalFlow: number) => void;
  onDone?: (maxFlow: number, rounds: number) => void;
}

interface ResArc {
  to: string;
  cap: number;
}

/** widest path：求 s-t 路径使瓶颈容量最大。类似 Dijkstra（最大堆）。 */
function widestPath(
  graph: Map<string, ResArc[]>,
  source: string,
  sink: string,
): { path: string[]; bottleneck: number } | null {
  const best = new Map<string, number>([[source, Infinity]]);
  const prev = new Map<string, string>([[source, '']]);
  const visited = new Set<string>();
  const allNodes = [...graph.keys()];
  for (;;) {
    // 选未访问中 best 最大的
    let u: string | null = null;
    let ub = -1;
    for (const n of allNodes) {
      if (visited.has(n)) continue;
      const b = best.get(n) ?? -1;
      if (b > ub) {
        ub = b;
        u = n;
      }
    }
    if (!u || ub <= 0) break;
    visited.add(u);
    if (u === sink) break;
    for (const a of graph.get(u) ?? []) {
      if (a.cap > 0 && !visited.has(a.to)) {
        const nb = Math.min(best.get(u)!, a.cap);
        if (nb > (best.get(a.to) ?? -1)) {
          best.set(a.to, nb);
          prev.set(a.to, u);
        }
      }
    }
  }
  if (!visited.has(sink)) return null;
  const path: string[] = [];
  let cur: string = sink;
  while (cur !== '') {
    path.push(cur);
    cur = prev.get(cur)!;
  }
  path.reverse();
  return { path, bottleneck: best.get(sink)! };
}

/** 最大瓶颈增广路求最大流。 */
export function widestAugmentingPath(
  nodes: readonly string[],
  edges: ReadonlyArray<WidestEdge>,
  source: string,
  sink: string,
  hooks: WidestHooks = {},
): number {
  const graph = new Map<string, ResArc[]>();
  for (const n of nodes) graph.set(n, []);
  for (const e of edges) {
    if (e.cap > 0) graph.get(e.from)!.push({ to: e.to, cap: e.cap });
  }
  for (const e of edges) {
    if (e.cap > 0) {
      if (!graph.get(e.to)!.some((a) => a.to === e.from))
        graph.get(e.to)!.push({ to: e.from, cap: 0 });
    }
  }

  let maxFlow = 0;
  let rounds = 0;
  for (;;) {
    const found = widestPath(graph, source, sink);
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
    hooks.onAugment?.(path, bottleneck, maxFlow);
  }
  hooks.onDone?.(maxFlow, rounds);
  return maxFlow;
}
