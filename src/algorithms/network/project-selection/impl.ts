// =============================================================================
// 项目选择（最大权闭合子图 → 最小割）· 纯算法实现
// 构造源汇网络，跑最大流，答案 = 正利润和 − 最小割。零 DOM 依赖，可独立单测。
// =============================================================================

export interface ProjectSelectionHooks {
  /** 构造完网络，给出正利润和 W。 */
  onNetwork?: (W: number) => void;
  /** 最大流（= 最小割）求出。 */
  onMinCut?: (minCut: number) => void;
  /** 算法结束，给出最大净收益。 */
  onDone?: (value: number) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

/**
 * 项目选择（最大权闭合子图）。
 *
 * @param n 项目数（0..n-1）
 * @param projects 每个项目利润 profit（正=收益，负=成本）
 * @param deps 依赖对 [u, v]：选 v 必须先选 u（构造 u→v 容量 ∞ 的边）
 * @param hooks 可选钩子
 * @returns 最大净收益
 */
export function projectSelection(
  n: number,
  projects: Array<{ profit: number }>,
  deps: ReadonlyArray<readonly [number, number]>,
  hooks: ProjectSelectionHooks = {},
): number {
  if (n <= 0) {
    hooks.onDone?.(0);
    return 0;
  }
  // 超大容量代表 ∞（依赖边不可割）
  const INF = projects.reduce((s, p) => s + Math.max(0, p.profit), 0) + 1;

  // 源 s = n，汇 t = n+1
  const s = n;
  const t = n + 1;
  const N = n + 2;
  const g: Arc[][] = Array.from({ length: N }, () => []);
  const addArc = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
  };

  // 正利润连 s→i；负利润连 i→t
  let W = 0;
  for (let i = 0; i < n; i++) {
    const p = projects[i]!.profit;
    if (p > 0) {
      addArc(s, i, p);
      W += p;
    } else if (p < 0) {
      addArc(i, t, -p);
    }
  }
  hooks.onNetwork?.(W);
  // 依赖边：[u, v] 表示"选 v 必须先选 u"。最大权闭合约束"选 v ⟹ 选 u"
  // 需添加 v→u 的 ∞ 容量弧（v 在 S 侧则 u 必在 S 侧，否则该弧横跨割为 ∞）。
  for (const [u, v] of deps) {
    if (u >= 0 && u < n && v >= 0 && v < n) addArc(v, u, INF);
  }

  // Dinic 最大流
  const level = new Array<number>(N).fill(-1);
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
  const cur = new Array<number>(N).fill(0);
  // DFS 推送：有限累加器 flow，避免 Infinity - Infinity = NaN。
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
  let minCut = 0;
  while (bfs()) {
    cur.fill(0);
    let pushed = dfs(s, Infinity);
    while (pushed > 0) {
      minCut += pushed;
      pushed = dfs(s, Infinity);
    }
  }
  hooks.onMinCut?.(minCut);
  const value = W - minCut;
  hooks.onDone?.(value);
  return value;
}

/** 求最大净收益与选中项目集合（S 侧非源点）。 */
export function projectSelectionSet(
  n: number,
  projects: Array<{ profit: number }>,
  deps: ReadonlyArray<readonly [number, number]>,
): { value: number; selected: Set<number> } {
  if (n <= 0) return { value: 0, selected: new Set() };
  const INF = projects.reduce((s, p) => s + Math.max(0, p.profit), 0) + 1;
  const s = n;
  const t = n + 1;
  const N = n + 2;
  const g: Arc[][] = Array.from({ length: N }, () => []);
  const addArc = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
  };
  for (let i = 0; i < n; i++) {
    const p = projects[i]!.profit;
    if (p > 0) {
      addArc(s, i, p);
    } else if (p < 0) {
      addArc(i, t, -p);
    }
  }
  for (const [u, v] of deps) {
    if (u >= 0 && u < n && v >= 0 && v < n) addArc(v, u, INF);
  }
  // Dinic
  const level = new Array<number>(N).fill(-1);
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
  const cur = new Array<number>(N).fill(0);
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
  while (bfs()) {
    cur.fill(0);
    let pushed = dfs(s, Infinity);
    while (pushed > 0) {
      pushed = dfs(s, Infinity);
    }
  }
  // S 侧 = 残量图上从 s 可达的点（除 s 自身）
  const reach = new Array<boolean>(N).fill(false);
  reach[s] = true;
  const q: number[] = [s];
  let h = 0;
  while (h < q.length) {
    const u = q[h]!;
    h++;
    const arcs = g[u]!;
    for (let i = 0; i < arcs.length; i++) {
      const a = arcs[i]!;
      if (a.cap > 0 && !reach[a.to]!) {
        reach[a.to] = true;
        q.push(a.to);
      }
    }
  }
  const selected = new Set<number>();
  let selProfit = 0;
  for (let i = 0; i < n; i++) {
    if (reach[i]) {
      selected.add(i);
      selProfit += projects[i]!.profit;
    }
  }
  return { value: selProfit, selected };
}
