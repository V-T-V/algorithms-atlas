// 流分解 · 实现

export interface FlowEdge {
  from: string;
  to: string;
  flow: number;
}

export interface DecomposedPath {
  /** 路径或环节点序列。 */
  nodes: string[];
  /** 该路径/环的流量。 */
  amount: number;
  /** 是否为环。 */
  isCycle: boolean;
}

/** 在正流残图上从 source 沿正流边 DFS 到 sink。 */
function findPath(
  adj: Map<string, Map<string, number>>,
  source: string,
  sink: string,
): string[] | null {
  const stack: string[] = [source];
  const prev = new Map<string, string>([[source, '']]);
  while (stack.length > 0) {
    const u = stack.pop()!;
    if (u === sink) {
      const path: string[] = [];
      let cur: string = sink;
      while (cur !== '') {
        path.push(cur);
        cur = prev.get(cur)!;
      }
      path.reverse();
      return path;
    }
    const outs = adj.get(u);
    if (!outs) continue;
    for (const [v, f] of outs) {
      if (f > 0 && !prev.has(v)) {
        prev.set(v, u);
        stack.push(v);
      }
    }
  }
  return null;
}

/** 在剩余正流图中找一个简单环（DFS 找回边）。 */
function findCycle(adj: Map<string, Map<string, number>>, nodes: string[]): string[] | null {
  for (const start of nodes) {
    const stack: string[] = [start];
    const prev = new Map<string, string>([[start, '']]);
    while (stack.length > 0) {
      const u = stack.pop()!;
      const outs = adj.get(u);
      if (!outs) continue;
      for (const [v, f] of outs) {
        if (f <= 0) continue;
        if (v === start && u !== start) {
          // 找到环：start...u->start
          const path: string[] = [];
          let cur: string = u;
          while (cur !== '') {
            path.push(cur);
            cur = prev.get(cur)!;
          }
          path.reverse();
          path.push(start);
          return path;
        }
        if (!prev.has(v)) {
          prev.set(v, u);
          stack.push(v);
        }
      }
    }
  }
  return null;
}

/** 沿路径/环减去瓶颈流量。 */
function subtractPath(adj: Map<string, Map<string, number>>, path: string[], amount: number): void {
  for (let i = 0; i + 1 < path.length; i++) {
    const u = path[i]!;
    const v = path[i + 1]!;
    const outs = adj.get(u)!;
    outs.set(v, outs.get(v)! - amount);
    if (outs.get(v) === 0) outs.delete(v);
  }
}

function bottleneck(adj: Map<string, Map<string, number>>, path: string[]): number {
  let b = Infinity;
  for (let i = 0; i + 1 < path.length; i++) {
    b = Math.min(b, adj.get(path[i]!)!.get(path[i + 1]!)!);
  }
  return b;
}

/** 将流分解为 s-t 路径流与环流。 */
export function decomposeFlow(
  edges: FlowEdge[],
  source: string,
  sink: string,
  allNodes: string[],
): DecomposedPath[] {
  const adj = new Map<string, Map<string, number>>();
  for (const n of allNodes) adj.set(n, new Map());
  for (const e of edges) {
    if (e.flow > 0) adj.get(e.from)!.set(e.to, (adj.get(e.from)!.get(e.to) ?? 0) + e.flow);
  }

  const result: DecomposedPath[] = [];
  // 阶段 1：提取 s-t 路径
  for (;;) {
    const path = findPath(adj, source, sink);
    if (!path) break;
    const amt = bottleneck(adj, path);
    result.push({ nodes: path, amount: amt, isCycle: false });
    subtractPath(adj, path, amt);
  }
  // 阶段 2：提取环流
  for (;;) {
    const cyc = findCycle(adj, allNodes);
    if (!cyc) break;
    const amt = bottleneck(adj, cyc);
    result.push({ nodes: cyc, amount: amt, isCycle: true });
    subtractPath(adj, cyc, amt);
  }
  return result;
}
