// =============================================================================
// 二分图最大匹配（Dinic 二分图 / Hopcroft-Karp 风格）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 思路：把二分图 (L, R, E) 转为网络：源 s→L（容 1），L→R 原边（容 1），R→汇 t（容 1）；
//       最大流 = 最大匹配。由于是单位容量二分图，Dinic 每轮 BFS+DFS 同时找多条
//       增广路，等价于 Hopcroft-Karp，复杂度 O(E√V)。
// =============================================================================

/** 二分图输入。 */
export interface BipartiteInput {
  /** 左部节点。 */
  left: readonly string[];
  /** 右部节点。 */
  right: readonly string[];
  /** 连边（from∈left, to∈right）。 */
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface DinicBipartiteHooks {
  /** 一轮 BFS 分层完成，本轮增广数量 augmented。 */
  onPhase?: (phase: number, augmented: number) => void;
  /** 找到一条匹配对。pair 为 [leftNode, rightNode]。 */
  onMatch?: (pair: [string, string]) => void;
  /** 算法完成：匹配数。 */
  onDone?: (matchCount: number) => void;
}

export interface DinicBipartiteResult {
  /** 最大匹配数。 */
  matchCount: number;
  /** 匹配对：left → right。 */
  matches: Array<[string, string]>;
  /** 左部每点是否被匹配。 */
  matchedLeft: Set<string>;
}

/**
 * 二分图最大匹配（基于 Dinic 的单位容量最大流）。
 *
 * @param input 二分图
 * @param hooks 可选事件钩子
 * @returns 匹配数与匹配对
 */
export function dinicBipartite(
  input: BipartiteInput,
  hooks: DinicBipartiteHooks = {},
): DinicBipartiteResult {
  const { left, right, edges } = input;
  const SRC = '__SRC__';
  const SINK = '__SINK__';
  const nodes = [SRC, ...left, ...right, SINK];

  interface E {
    to: string;
    cap: number;
    rev: number;
  }
  const graph = new Map<string, E[]>();
  for (const n of nodes) graph.set(n, []);
  const addEdge = (from: string, to: string, cap: number): void => {
    if (!graph.has(from) || !graph.has(to)) return;
    const fwd: E = { to, cap, rev: 0 };
    const rev: E = { to: from, cap: 0, rev: 0 };
    fwd.rev = graph.get(to)!.length;
    rev.rev = graph.get(from)!.length;
    graph.get(from)!.push(fwd);
    graph.get(to)!.push(rev);
  };

  for (const l of left) addEdge(SRC, l, 1);
  for (const r of right) addEdge(r, SINK, 1);
  for (const e of edges) addEdge(e.from, e.to, 1);

  const level = new Map<string, number>();
  const iter = new Map<string, number>();

  const bfs = (): boolean => {
    for (const n of nodes) level.set(n, -1);
    level.set(SRC, 0);
    const queue: string[] = [SRC];
    let h = 0;
    while (h < queue.length) {
      const u = queue[h]!;
      h++;
      const lu = level.get(u)!;
      for (const e of graph.get(u) ?? []) {
        if (e.cap > 0 && level.get(e.to) === -1) {
          level.set(e.to, lu + 1);
          queue.push(e.to);
        }
      }
    }
    return level.get(SINK) !== -1;
  };

  const dfs = (u: string, pushedIn: number): number => {
    if (u === SINK) return pushedIn;
    const lu = level.get(u)!;
    const adj = graph.get(u)!;
    while (iter.get(u)! < adj.length) {
      const ei = iter.get(u)!;
      const e = adj[ei]!;
      if (e.cap > 0 && level.get(e.to) === lu + 1) {
        const got = dfs(e.to, Math.min(pushedIn, e.cap));
        if (got > 0) {
          e.cap -= got;
          graph.get(e.to)![e.rev]!.cap += got;
          return got;
        }
      }
      iter.set(u, ei + 1);
    }
    return 0;
  };

  let matchCount = 0;
  let phase = 0;
  while (bfs()) {
    phase++;
    for (const n of nodes) iter.set(n, 0);
    let augThisPhase = 0;
    let f = dfs(SRC, 1);
    while (f > 0) {
      matchCount += f;
      augThisPhase += f;
      f = dfs(SRC, 1);
    }
    hooks.onPhase?.(phase, augThisPhase);
  }

  // 提取匹配：扫描 left 的出边，cap 从 1 变 0 的即为匹配边
  const matches: Array<[string, string]> = [];
  const matchedLeft = new Set<string>();
  const rightSet = new Set(right);
  for (const l of left) {
    for (const e of graph.get(l) ?? []) {
      if (rightSet.has(e.to) && e.cap === 0) {
        matches.push([l, e.to]);
        matchedLeft.add(l);
      }
    }
  }

  for (const m of matches) hooks.onMatch?.(m);
  hooks.onDone?.(matchCount);

  return { matchCount, matches, matchedLeft };
}
