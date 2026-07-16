// =============================================================================
// 上下界可行环流（Circulation）· 纯算法实现
// 构造超级源汇 + 强制下界流量，跑最大流判定可行性。零 DOM 依赖，可独立单测。
// =============================================================================

export interface CircEdgeInput {
  from: number;
  to: number;
  /** 下界（>= 0）。 */
  lo: number;
  /** 上界（>= lo）。 */
  hi: number;
}

export interface CircHooks {
  /** 计算完各节点盈余 d[]。 */
  onExcess?: (d: number[]) => void;
  /** 超级源汇构造完成，给出 ss、tt 下标与需满足的总需求。 */
  onSuperGraph?: (ss: number, tt: number, totalDemand: number) => void;
  /** 最大流求出，给出是否可行。 */
  onResult?: (feasible: boolean, maxFlow: number, totalDemand: number) => void;
  /** 算法结束。 */
  onDone?: (feasible: boolean) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

/** 内部最大流（带残量图返回，便于事后读各边实际流量）。 */
function maxFlowWithResidual(
  n: number,
  edges: Array<{ from: number; to: number; cap: number }>,
  s: number,
  t: number,
): { flow: number; g: Arc[][] } {
  const g: Arc[][] = Array.from({ length: n }, () => []);
  const addArc = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
  };
  for (const e of edges) {
    if (e.cap > 0) addArc(e.from, e.to, e.cap);
  }
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
  // dinic blocking-flow DFS with current-arc optimization.
  // Tracks a finite `flow` accumulator instead of decrementing `pushed`,
  // so a top-level `dfs(s, Infinity)` never computes Infinity - Infinity.
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

/**
 * 上下界可行环流判定。
 *
 * @param n 节点数（0..n-1）
 * @param edges 边 {from, to, lo, hi}
 * @param hooks 可选钩子
 * @returns 是否存在可行环流
 */
export function circulation(
  n: number,
  edges: readonly CircEdgeInput[],
  hooks: CircHooks = {},
): boolean {
  if (n <= 0) {
    hooks.onDone?.(true);
    return true;
  }

  // 1. 计算各节点盈余 d[u]（强制下界后的净流出）
  const d = new Array<number>(n).fill(0);
  for (const e of edges) {
    if (e.lo < 0 || e.hi < e.lo) {
      hooks.onDone?.(false);
      return false;
    }
    d[e.from] = (d[e.from] ?? 0) - e.lo;
    d[e.to] = (d[e.to] ?? 0) + e.lo;
  }
  hooks.onExcess?.([...d]);

  // 2. 超级源 ss = n，超级汇 tt = n+1
  const ss = n;
  const tt = n + 1;
  const N = n + 2;
  let totalDemand = 0;
  const superEdges: Array<{ from: number; to: number; cap: number }> = [];
  for (const e of edges) {
    if (e.hi - e.lo > 0) superEdges.push({ from: e.from, to: e.to, cap: e.hi - e.lo });
  }
  for (let u = 0; u < n; u++) {
    if (d[u]! > 0) {
      // 净入 > 净出，需从 ss 补入
      superEdges.push({ from: ss, to: u, cap: d[u]! });
      totalDemand += d[u]!;
    } else if (d[u]! < 0) {
      superEdges.push({ from: u, to: tt, cap: -d[u]! });
    }
  }
  hooks.onSuperGraph?.(ss, tt, totalDemand);

  // 3. 跑 ss→tt 最大流
  const { flow } = maxFlowWithResidual(N, superEdges, ss, tt);
  const feasible = flow >= totalDemand;
  hooks.onResult?.(feasible, flow, totalDemand);
  hooks.onDone?.(feasible);
  return feasible;
}

/** 求一个可行环流并返回每条边的实际流量（不可行返回 null）。 */
export function feasibleCirculation(
  n: number,
  edges: readonly CircEdgeInput[],
): Array<{ from: number; to: number; flow: number }> | null {
  if (n <= 0) return [];
  // 复用 circulation 逻辑并提取残量图
  const d = new Array<number>(n).fill(0);
  for (const e of edges) {
    if (e.lo < 0 || e.hi < e.lo) return null;
    d[e.from] = (d[e.from] ?? 0) - e.lo;
    d[e.to] = (d[e.to] ?? 0) + e.lo;
  }
  const ss = n;
  const tt = n + 1;
  const N = n + 2;
  let totalDemand = 0;
  const g: Arc[][] = Array.from({ length: N }, () => []);
  const addArc = (u: number, v: number, cap: number): number => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
    return g[u]!.length - 1;
  };
  // 原边 + 记录每条原边的弧索引
  const arcIdx: number[] = edges.map((e) => addArc(e.from, e.to, e.hi - e.lo));
  for (let u = 0; u < n; u++) {
    if (d[u]! > 0) {
      addArc(ss, u, d[u]!);
      totalDemand += d[u]!;
    } else if (d[u]! < 0) {
      addArc(u, tt, -d[u]!);
    }
  }
  // dinic 求最大流
  const directed = edges.map((e) => ({ from: e.from, to: e.to, cap: e.hi - e.lo }));
  // 用独立最大流验证可行性
  const feasible = circulation(n, edges);
  if (!feasible) return null;
  // 重新跑一次拿到残量
  void directed;
  const level = new Array<number>(N).fill(-1);
  const bfs = (): boolean => {
    level.fill(-1);
    level[ss] = 0;
    const q: number[] = [ss];
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
    return level[tt]! >= 0;
  };
  const cur = new Array<number>(N).fill(0);
  const dfs = (u: number, pushed: number): number => {
    if (u === tt) return pushed;
    const arcs = g[u]!;
    let flow = 0;
    while (cur[u]! < arcs.length) {
      const i = cur[u]!;
      const a = arcs[i]!;
      if (a.cap > 0 && level[a.to]! === level[u]! + 1) {
        const limit = pushed === Infinity ? a.cap : pushed - flow;
        const dd = dfs(a.to, Math.min(limit, a.cap));
        if (dd > 0) {
          a.cap -= dd;
          g[a.to]![a.rev]!.cap += dd;
          flow += dd;
          if (pushed !== Infinity && flow === pushed) break;
          continue;
        }
      }
      cur[u] = cur[u]! + 1;
    }
    return flow;
  };
  while (bfs()) {
    cur.fill(0);
    let pushed = dfs(ss, Infinity);
    while (pushed > 0) {
      pushed = dfs(ss, Infinity);
    }
  }
  void totalDemand;
  // 实际流量 = 下界 + (原容量 - 残量)
  return edges.map((e, i) => {
    const arc = g[e.from]![arcIdx[i]!]!;
    const residual = arc.cap;
    const used = e.hi - e.lo - residual;
    return { from: e.from, to: e.to, flow: e.lo + used };
  });
}
