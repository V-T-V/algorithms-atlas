// =============================================================================
// 两点不相交路径（最大流法）· 纯算法实现
// 点拆分 + 单位容量 BFS 增广（Edmonds-Karp），流量上界 2。
// =============================================================================
export interface Flow2DisjointHooks {
  onAugment?: (path: number[], totalFlow: number) => void;
  onResult?: (paths: number[][]) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

class Graph {
  adj: Arc[][];
  constructor(n: number) {
    this.adj = Array.from({ length: n }, () => []);
  }
  addEdge(u: number, v: number, cap: number): void {
    this.adj[u]!.push({ to: v, cap, rev: this.adj[v]!.length });
    this.adj[v]!.push({ to: u, cap: 0, rev: this.adj[u]!.length - 1 });
  }
}

export interface Flow2DisjointInput {
  /** 原始节点数（0..n-1）。 */
  n: number;
  /** 有向边列表。 */
  edges: Array<{ from: number; to: number }>;
  /** 源点。 */
  s: number;
  /** 汇点。 */
  t: number;
}

export function twoDisjointPaths(
  input: Flow2DisjointInput,
  hooks: Flow2DisjointHooks = {},
): number[][] {
  const { n, s, t } = input;
  // 点拆分：节点 v -> v_in=2v, v_out=2v+1；s、t 不限内部容量
  const N = 2 * n;
  const g = new Graph(N);
  for (let v = 0; v < n; v++) {
    g.addEdge(2 * v, 2 * v + 1, v === s || v === t ? Infinity : 1);
  }
  for (const e of input.edges) {
    g.addEdge(2 * e.from + 1, 2 * e.to, 1);
  }
  const S = 2 * s + 1; // s_out
  const T = 2 * t; // t_in

  let totalFlow = 0;
  const foundPaths: number[][] = [];
  const bfs = (): number[] | null => {
    const prev = new Array<number>(N).fill(-1);
    const prevArc = new Array<number>(N).fill(-1);
    const visited = new Array<boolean>(N).fill(false);
    visited[S] = true;
    const queue: number[] = [S];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++]!;
      if (u === T) break;
      for (let i = 0; i < g.adj[u]!.length; i++) {
        const a = g.adj[u]![i]!;
        if (!visited[a.to] && a.cap > 0) {
          visited[a.to] = true;
          prev[a.to] = u;
          prevArc[a.to] = i;
          queue.push(a.to);
        }
      }
    }
    if (!visited[T]) return null;
    // 回溯路径（残量图节点），瓶颈 = 1（单位容量）
    const pathNodes: number[] = [];
    let cur = T;
    while (cur !== S) {
      const p = prev[cur]!;
      const ai = prevArc[cur]!;
      g.adj[p]![ai]!.cap -= 1;
      g.adj[cur]![g.adj[p]![ai]!.rev]!.cap += 1;
      pathNodes.push(cur);
      cur = p;
    }
    pathNodes.push(S);
    pathNodes.reverse();
    totalFlow += 1;
    // 把残量图节点序列还原为原始节点序列：
    // S=s_out, T=t_in，中间节点成对出现 v_in(2v)->v_out(2v+1)
    const orig: number[] = [s];
    for (const x of pathNodes) {
      if (x === S || x === T) continue;
      const v = Math.floor(x / 2);
      if (x % 2 === 1 && v !== s && v !== t) {
        // v_out：该原始节点被「穿过」
        if (orig[orig.length - 1] !== v) orig.push(v);
      }
    }
    orig.push(t);
    foundPaths.push(orig);
    hooks.onAugment?.(pathNodes, totalFlow);
    return pathNodes;
  };

  // 至多增广到流量 2（只求 2 条）
  bfs();
  if (totalFlow < 2) bfs();

  if (totalFlow < 2) {
    hooks.onResult?.([]);
    return [];
  }
  hooks.onResult?.(foundPaths);
  return foundPaths;
}
