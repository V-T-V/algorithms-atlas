// =============================================================================
// Gomory-Hu 树（全局最小割树）· 纯算法实现
// 标准 Gomory-Hu 构造：对每个非根点跑一次 p-v 最大流，按割侧重父。
// 共 V-1 次最大流。零 DOM 依赖，可独立单测。
// =============================================================================

export interface GhEdgeInput {
  from: number;
  to: number;
  cap: number;
}

export interface GhTreeEdge {
  from: number;
  to: number;
  weight: number;
}

export interface GhHooks {
  /** 开始处理节点 v（其父为 parent）。 */
  onVertex?: (v: number, parent: number) => void;
  /** 一次最大流求出 v 与 parent 间的最小割 weight。 */
  onFlow?: (v: number, parent: number, weight: number) => void;
  /** 算法结束，给出树边列表。 */
  onDone?: (tree: GhTreeEdge[]) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

/** 无向图最大流，返回流量与残量邻接表（供割侧判定）。 */
function undirectedMaxFlowWithResidual(
  n: number,
  edges: readonly GhEdgeInput[],
  s: number,
  t: number,
): { flow: number; g: Arc[][] } {
  const g: Arc[][] = Array.from({ length: n }, () => []);
  const addArc = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
  };
  // 无向边 → 两条有向弧（容量各为 cap）
  for (const e of edges) {
    if (e.cap > 0) {
      addArc(e.from, e.to, e.cap);
      addArc(e.to, e.from, e.cap);
    }
  }
  // BFS 分层
  const level = new Array<number>(n).fill(-1);
  const bfs = (): boolean => {
    level.fill(-1);
    level[s] = 0;
    const q: number[] = [s];
    let h = 0;
    while (h < q.length) {
      const u = q[h]!;
      h++;
      const arcs = g[u]!;
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i]!;
        if (a.cap > 0 && level[a.to]! < 0) {
          level[a.to] = level[u]! + 1;
          q.push(a.to);
        }
      }
    }
    return level[t]! >= 0;
  };
  const cur = new Array<number>(n).fill(0);
  // DFS 推送：用有限累加器 flow 替代递减 pushed，避免 Infinity - Infinity = NaN。
  const dfs = (u: number, pushed: number): number => {
    if (u === t) return pushed;
    const arcs = g[u]!;
    let flow = 0;
    while (cur[u]! < arcs.length) {
      const i = cur[u]!;
      const a = arcs[i]!;
      if (a.cap > 0 && level[a.to]! === level[u]! + 1) {
        const limit = pushed === Infinity ? a.cap : pushed - flow;
        const d = dfs(a.to, Math.min(limit, a.cap));
        if (d > 0) {
          a.cap -= d;
          g[a.to]![a.rev]!.cap += d;
          flow += d;
          if (pushed !== Infinity && flow === pushed) break;
          continue;
        }
      }
      cur[u] = cur[u]! + 1;
    }
    return flow;
  };
  let flow = 0;
  while (bfs()) {
    cur.fill(0);
    let pushed = dfs(s, Infinity);
    while (pushed > 0) {
      flow += pushed;
      pushed = dfs(s, Infinity);
    }
  }
  return { flow, g };
}

/** 残量图上从 start 可达的点集。 */
function residualReachable(g: Arc[][], n: number, start: number): boolean[] {
  const reach = new Array<boolean>(n).fill(false);
  reach[start] = true;
  const queue: number[] = [start];
  let head = 0;
  while (head < queue.length) {
    const u = queue[head]!;
    head++;
    const arcs = g[u]!;
    for (let i = 0; i < arcs.length; i++) {
      const a = arcs[i]!;
      if (a.cap > 0 && !reach[a.to]!) {
        reach[a.to] = true;
        queue.push(a.to);
      }
    }
  }
  return reach;
}

/**
 * Gomory-Hu 树（标准构造）。
 *
 * @param n 节点数（0..n-1）
 * @param edges 无向边 {from, to, cap}
 * @param hooks 可选钩子
 * @returns 树边 [from, to, weight][]（共 n-1 条）
 */
export function gomoryHuTree(
  n: number,
  edges: readonly GhEdgeInput[],
  hooks: GhHooks = {},
): number[][] {
  if (n <= 1) {
    hooks.onDone?.([]);
    return [];
  }

  const parent = new Array<number>(n).fill(0);
  const tree: number[][] = [];

  for (let s = 1; s < n; s++) {
    const t = parent[s]!;
    hooks.onVertex?.(s, t);
    const { flow, g } = undirectedMaxFlowWithResidual(n, edges, s, t);
    // 树边 (s, t, flow)
    tree.push([s, t, flow]);
    hooks.onFlow?.(s, t, flow);
    // 割侧：从 s 在残量图可达的点集 = S 侧
    const reach = residualReachable(g, n, s);
    // 组内重父：i < s 且 parent[i] === t 的点，若在 S 侧则改 parent[i] = s
    for (let i = 0; i < n; i++) {
      if (i === s) continue;
      if (parent[i]! === t && reach[i]!) {
        parent[i] = s;
      }
    }
  }

  hooks.onDone?.(tree.map((e) => ({ from: e[0]!, to: e[1]!, weight: e[2]! })));
  return tree;
}

/** 查询树上 s-t 路径瓶颈（最小权边）。不连通返回 -1，s===t 返回 Infinity。 */
export function treeBottleneck(tree: number[][], s: number, t: number): number {
  if (s === t) return Infinity;
  const adj = new Map<number, Array<{ to: number; w: number }>>();
  for (const e of tree) {
    const u = e[0]!;
    const v = e[1]!;
    const w = e[2]!;
    if (!adj.has(u)) adj.set(u, []);
    if (!adj.has(v)) adj.set(v, []);
    adj.get(u)!.push({ to: v, w });
    adj.get(v)!.push({ to: u, w });
  }
  const visited = new Set<number>([s]);
  const queue: Array<{ node: number; minW: number }> = [{ node: s, minW: Infinity }];
  let head = 0;
  while (head < queue.length) {
    const { node, minW } = queue[head]!;
    head++;
    if (node === t) return minW;
    const nbrs = adj.get(node) ?? [];
    for (const { to, w } of nbrs) {
      if (!visited.has(to)) {
        visited.add(to);
        queue.push({ node: to, minW: Math.min(minW, w) });
      }
    }
  }
  return -1;
}
