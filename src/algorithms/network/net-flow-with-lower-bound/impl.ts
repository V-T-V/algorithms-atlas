// =============================================================================
// 带下界的最大流 · 纯算法实现
// 超级源汇法：拆掉下界义务，先判可行，再增广 s→t。
// 教学版：仅处理「下界可行」的情形，返回 s→t 的最大流（含下界义务）。
// =============================================================================
export interface LowerBoundFlowHooks {
  onFeasible?: (ok: boolean) => void;
  onAugment?: (path: number[], flow: number, total: number) => void;
  onResult?: (maxFlow: number) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

class FlowGraph {
  adj: Arc[][];
  constructor(n: number) {
    this.adj = Array.from({ length: n }, () => []);
  }
  addEdge(u: number, v: number, cap: number): void {
    if (cap <= 0) return;
    this.adj[u]!.push({ to: v, cap, rev: this.adj[v]!.length });
    this.adj[v]!.push({ to: u, cap: 0, rev: this.adj[u]!.length - 1 });
  }
  bfsAugment(s: number, t: number): number {
    const n = this.adj.length;
    const prev = new Array<number>(n).fill(-1);
    const prevArc = new Array<number>(n).fill(-1);
    const visited = new Array<boolean>(n).fill(false);
    visited[s] = true;
    const q: number[] = [s];
    let head = 0;
    while (head < q.length) {
      const u = q[head++]!;
      if (u === t) break;
      for (let i = 0; i < this.adj[u]!.length; i++) {
        const a = this.adj[u]![i]!;
        if (!visited[a.to] && a.cap > 0) {
          visited[a.to] = true;
          prev[a.to] = u;
          prevArc[a.to] = i;
          q.push(a.to);
        }
      }
    }
    if (!visited[t]) return 0;
    // 瓶颈
    let bottle = Infinity;
    let cur = t;
    while (cur !== s) {
      const p = prev[cur]!;
      bottle = Math.min(bottle, this.adj[p]![prevArc[cur]!]!.cap);
      cur = p;
    }
    cur = t;
    while (cur !== s) {
      const p = prev[cur]!;
      const ai = prevArc[cur]!;
      this.adj[p]![ai]!.cap -= bottle;
      this.adj[cur]![this.adj[p]![ai]!.rev]!.cap += bottle;
      cur = p;
    }
    return bottle;
  }
  maxflow(s: number, t: number, hooks?: LowerBoundFlowHooks): number {
    let total = 0;
    let f: number;
    while ((f = this.bfsAugment(s, t)) > 0) {
      total += f;
      if (hooks) {
        // 简单路径回溯（教学，仅给 total）
        hooks.onAugment?.([], f, total);
      }
    }
    return total;
  }
}

export interface LowerBoundFlowInput {
  n: number;
  edges: Array<{ from: number; to: number; low: number; cap: number }>;
  s: number;
  t: number;
}

export function maxFlowWithLowerBound(
  input: LowerBoundFlowInput,
  hooks: LowerBoundFlowHooks = {},
): number {
  const { n, s, t } = input;
  const SS = n;
  const TT = n + 1;
  const N = n + 2;
  const g = new FlowGraph(N);
  const excess = new Array<number>(n).fill(0);
  let lowerSum = 0;
  for (const e of input.edges) {
    // 下界义务：u 必须 low 流入、v 必须 low 流出
    // 残量图上保留 cap-low 的边
    g.addEdge(e.from, e.to, e.cap - e.low);
    excess[e.to]! += e.low;
    excess[e.from]! -= e.low;
    lowerSum += e.low;
  }
  // 平衡：excess>0 的点需要 SS 供；<0 的点需要排到 TT
  for (let v = 0; v < n; v++) {
    if (excess[v]! > 0) g.addEdge(SS, v, excess[v]!);
    else if (excess[v]! < 0) g.addEdge(v, TT, -excess[v]!);
  }
  // t -> s 无穷边，把原问题化为环流（便于判可行）
  g.addEdge(t, s, Infinity);
  // 1) SS->TT 最大流判定可行
  g.maxflow(SS, TT);
  // 检查 SS 出边是否流满
  let feasible = true;
  for (const a of g.adj[SS]!) if (a.cap > 0) feasible = false;
  hooks.onFeasible?.(feasible);
  if (!feasible) {
    hooks.onResult?.(-1);
    return -1;
  }
  // 2) 在原图残量上从 s->t 继续增广（t->s 的反向弧 cap 即当前 s->t 流量）
  // 先把 t->s 边的「已用容量」记下
  let baseFlow = 0;
  for (const a of g.adj[t]!) if (a.to === s) baseFlow = g.adj[s]![a.rev]!.cap;
  const more = g.maxflow(s, t, hooks);
  const total = baseFlow + more;
  hooks.onResult?.(total);
  return total;
}
