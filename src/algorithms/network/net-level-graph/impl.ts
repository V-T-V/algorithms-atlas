// 分层图 · 实现

export interface ResEdge {
  to: number;
  cap: number;
  /** 是否为原图正向边（vs 反向边）。 */
  isForward: boolean;
}

export interface LevelGraphHooks {
  onVisit?: (u: number, v: number, level: number) => void;
  onLevel?: (levels: number[]) => void;
}

/** 残量图邻接表。 */
export type ResidualGraph = Map<number, ResEdge[]>;

/** 用 BFS 构造分层图：返回各节点 level（-1 不可达）与分层后的邻接表（仅保留到高层边）。 */
export function buildLevelGraph(
  graph: ResidualGraph,
  n: number,
  source: number,
  sink: number,
  hooks: LevelGraphHooks = {},
): { levels: number[]; levelGraph: ResidualGraph } {
  const levels = new Array<number>(n).fill(-1);
  levels[source] = 0;
  const queue: number[] = [source];
  let head = 0;
  while (head < queue.length) {
    const u = queue[head]!;
    head++;
    if (u === sink) continue;
    for (const a of graph.get(u) ?? []) {
      if (a.cap > 0 && levels[a.to]! < 0) {
        levels[a.to] = levels[u]! + 1;
        hooks.onVisit?.(u, a.to, levels[a.to]!);
        queue.push(a.to);
      }
    }
  }
  hooks.onLevel?.([...levels]);

  // 构造分层邻接表：只保留 cap>0 且 level 严格上升的边
  const levelGraph: ResidualGraph = new Map();
  for (let i = 0; i < n; i++) levelGraph.set(i, []);
  for (let u = 0; u < n; u++) {
    if (levels[u]! < 0) continue;
    for (const a of graph.get(u) ?? []) {
      if (a.cap > 0 && levels[a.to] === levels[u]! + 1) {
        levelGraph.get(u)!.push({ ...a });
      }
    }
  }
  return { levels, levelGraph };
}

/** 判断汇点是否可达（分层图中）。 */
export function sinkReachable(levels: number[], sink: number): boolean {
  return levels[sink]! >= 0;
}
