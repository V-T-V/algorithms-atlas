// 阻塞流 · 实现

export interface BlockEdge {
  to: number;
  cap: number;
}

export type BlockGraph = Map<number, BlockEdge[]>;

export interface BlockingFlowHooks {
  onAugment?: (path: number[], flow: number) => void;
  onAdvance?: (u: number, to: number) => void;
}

/** 在分层图上用 DFS（当前弧优化）求阻塞流，返回流量并就地修改图（减容量）。 */
export function blockingFlow(
  graph: BlockGraph,
  n: number,
  source: number,
  sink: number,
  hooks: BlockingFlowHooks = {},
): number {
  // 当前弧下标
  const curArc = new Array<number>(n).fill(0);
  let total = 0;

  const dfs = (u: number, pushed: number): number => {
    if (u === sink) return pushed;
    const arcs = graph.get(u) ?? [];
    for (; curArc[u]! < arcs.length; curArc[u] = curArc[u]! + 1) {
      const a = arcs[curArc[u]!]!;
      if (a.cap > 0) {
        hooks.onAdvance?.(u, a.to);
        const tr = dfs(a.to, Math.min(pushed, a.cap));
        if (tr > 0) {
          a.cap -= tr;
          return tr;
        }
      }
    }
    return 0;
  };

  for (;;) {
    // 重置当前弧
    for (let i = 0; i < n; i++) curArc[i] = 0;
    const f = dfs(source, Infinity);
    if (f === 0) break;
    total += f;
    // 回溯路径用于钩子（简化：从 source 到 sink 的路径需另存）
    hooks.onAugment?.([], f);
  }
  return total;
}

/** 带路径追踪的阻塞流（记录每条增广路）。 */
export function blockingFlowTracked(
  graph: BlockGraph,
  n: number,
  source: number,
  sink: number,
): { total: number; paths: Array<{ path: number[]; flow: number }> } {
  const curArc = new Array<number>(n).fill(0);
  const paths: Array<{ path: number[]; flow: number }> = [];
  let total = 0;

  const dfs = (u: number, pushed: number, path: number[]): number => {
    if (u === sink) {
      paths.push({ path: [...path, sink], flow: pushed });
      return pushed;
    }
    const arcs = graph.get(u) ?? [];
    for (; curArc[u]! < arcs.length; curArc[u] = curArc[u]! + 1) {
      const a = arcs[curArc[u]!]!;
      if (a.cap > 0) {
        const tr = dfs(a.to, Math.min(pushed, a.cap), [...path, u]);
        if (tr > 0) {
          a.cap -= tr;
          return tr;
        }
      }
    }
    return 0;
  };

  for (;;) {
    for (let i = 0; i < n; i++) curArc[i] = 0;
    const f = dfs(source, Infinity, []);
    if (f === 0) break;
    total += f;
  }
  return { total, paths };
}
