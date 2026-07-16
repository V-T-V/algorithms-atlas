// =============================================================================
// k 条边不相交路径（最大流法）· 纯算法实现
// 单位容量 BFS 增广；每条增广路即一条边不相交路径。
// =============================================================================
export interface FlowKDisjointHooks {
  onAugment?: (path: number[], totalFlow: number) => void;
  onResult?: (paths: number[][], maxFlow: number) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

export interface FlowKDisjointInput {
  n: number;
  edges: Array<{ from: number; to: number }>;
  s: number;
  t: number;
  /** 最多需要的路径条数；不填则求最大。 */
  k?: number;
}

export function kDisjointPaths(
  input: FlowKDisjointInput,
  hooks: FlowKDisjointHooks = {},
): number[][] {
  const { n, s, t } = input;
  const k = input.k ?? Infinity;
  const adj: Arc[][] = Array.from({ length: n }, () => []);
  const addEdge = (u: number, v: number): void => {
    adj[u]!.push({ to: v, cap: 1, rev: adj[v]!.length });
    adj[v]!.push({ to: u, cap: 0, rev: adj[u]!.length - 1 });
  };
  for (const e of input.edges) addEdge(e.from, e.to);

  const paths: number[][] = [];
  let totalFlow = 0;
  while (totalFlow < k) {
    const prev = new Array<number>(n).fill(-1);
    const prevArc = new Array<number>(n).fill(-1);
    const visited = new Array<boolean>(n).fill(false);
    visited[s] = true;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++]!;
      if (u === t) break;
      for (let i = 0; i < adj[u]!.length; i++) {
        const a = adj[u]![i]!;
        if (!visited[a.to] && a.cap > 0) {
          visited[a.to] = true;
          prev[a.to] = u;
          prevArc[a.to] = i;
          queue.push(a.to);
        }
      }
    }
    if (!visited[t]) break;
    const path: number[] = [];
    let cur = t;
    while (cur !== s) {
      const p = prev[cur]!;
      const ai = prevArc[cur]!;
      adj[p]![ai]!.cap -= 1;
      adj[cur]![adj[p]![ai]!.rev]!.cap += 1;
      path.push(cur);
      cur = p;
    }
    path.push(s);
    path.reverse();
    paths.push(path);
    totalFlow += 1;
    hooks.onAugment?.(path, totalFlow);
  }
  hooks.onResult?.(paths, totalFlow);
  return paths;
}
