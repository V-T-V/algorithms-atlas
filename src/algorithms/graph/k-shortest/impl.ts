// =============================================================================
// 第 K 短路（Yen's K-Shortest Simple Paths）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// Yen 算法：在非负权有向图上求 s→t 的 K 条最短「简单路径」（无重复节点）。
//   - 用 Dijkstra 求最短路径作 P[0]
//   - 对 P[k-1] 的每个前缀，临时禁用已选路径上的某些边，再用 Dijkstra 求最短「偏离」
//   - 候选集合取最小者作为 P[k]，重复直至收集 K 条或候选耗尽
// =============================================================================

/** 有向非负权图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  source: string;
  target: string;
  /** 要找的前 K 条路径。 */
  k: number;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface KShortestHooks {
  /** 找到第 (i+1) 短路径 path，总权 weight。 */
  onPath?: (i: number, path: string[], weight: number) => void;
  /** 一次偏离搜索：根路径根 spurNode、禁用边集 banned。 */
  onDeviation?: (spurNode: string, banned: ReadonlyArray<{ from: string; to: string }>) => void;
  /** 算法完成：实际找到的路径数。 */
  onDone?: (count: number) => void;
}

export interface KShortestResult {
  /** 找到的前 K 条路径（按权递增）。 */
  paths: Array<{ path: string[]; weight: number }>;
}

interface DijkstraResult {
  dist: Map<string, number>;
  prev: Map<string, string | null>;
}

/** 带禁用边集合的 Dijkstra。 */
function dijkstra(
  nodes: readonly string[],
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>,
  source: string,
  bannedEdges: Set<string>,
  bannedNodes: Set<string>,
): DijkstraResult {
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (bannedNodes.has(e.from) || bannedNodes.has(e.to)) continue;
    if (bannedEdges.has(`${e.from}>${e.to}`)) continue;
    adj.get(e.from)?.push({ to: e.to, w: e.weight });
  }
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  for (const n of nodes) {
    dist.set(n, Infinity);
    prev.set(n, null);
  }
  if (!nodes.includes(source)) return { dist, prev };
  dist.set(source, 0);
  const settled = new Set<string>();
  const queue: Array<{ id: string; d: number }> = [{ id: source, d: 0 }];
  while (queue.length > 0) {
    // 取最小（线性）
    let mi = 0;
    for (let i = 1; i < queue.length; i++) if (queue[i]!.d < queue[mi]!.d) mi = i;
    const { id: u, d: du } = queue.splice(mi, 1)[0]!;
    if (settled.has(u)) continue;
    settled.add(u);
    for (const { to, w } of adj.get(u) ?? []) {
      if (settled.has(to)) continue;
      const nd = du + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        prev.set(to, u);
        queue.push({ id: to, d: nd });
      }
    }
  }
  return { dist, prev };
}

/** 回溯 source→target 的路径。 */
function reconstruct(
  prev: Map<string, string | null>,
  source: string,
  target: string,
): string[] | null {
  if (!prev.has(target) && source !== target) return null;
  const path: string[] = [];
  let cur: string | null = target;
  let guard = 0;
  while (cur !== null && guard <= prev.size + 1) {
    guard++;
    path.push(cur);
    if (cur === source) break;
    cur = prev.get(cur) ?? null;
  }
  if (path[path.length - 1] !== source) return null;
  path.reverse();
  return path;
}

/**
 * Yen 第 K 短简单路径。
 *
 * @param input 有向非负权图 + source/target/k
 * @param hooks 可选事件钩子
 * @returns 前 K 条最短简单路径
 */
export function kShortest(input: GraphInput, hooks: KShortestHooks = {}): KShortestResult {
  const { nodes, edges, source, target, k } = input;
  if (k <= 0 || !nodes.includes(source) || !nodes.includes(target)) {
    hooks.onDone?.(0);
    return { paths: [] };
  }

  // P[0]
  const first = dijkstra(nodes, edges, source, new Set(), new Set());
  const firstPath = reconstruct(first.prev, source, target);
  if (firstPath === null) {
    hooks.onDone?.(0);
    return { paths: [] };
  }
  const A: Array<{ path: string[]; weight: number }> = [
    { path: firstPath, weight: first.dist.get(target) ?? Infinity },
  ];
  hooks.onPath?.(0, firstPath, first.dist.get(target) ?? Infinity);

  const B: Map<string, { path: string[]; weight: number }> = new Map(); // 候选（key=路径序列）

  for (let kk = 1; kk < k; kk++) {
    const prevPath = A[A.length - 1]!.path;
    let foundCandidate = false;

    for (let i = 0; i < prevPath.length - 1; i++) {
      const spurNode = prevPath[i]!;
      const rootPath = prevPath.slice(0, i + 1);
      const rootWeight = A[A.length - 1]!.weight;
      // 计算 rootPath 的权
      let rw = 0;
      for (let j = 0; j < rootPath.length - 1; j++) {
        const a = rootPath[j]!;
        const b = rootPath[j + 1]!;
        const ed = edges.find((e) => e.from === a && e.to === b);
        rw += ed?.weight ?? 0;
      }
      void rootWeight;

      // 禁用边：所有已选 A 中与 rootPath 共享前缀的路径的「下一条边」
      const bannedEdges = new Set<string>();
      for (const p of A) {
        if (p.path.length > i && p.path.slice(0, i + 1).join(',') === rootPath.join(',')) {
          const a = p.path[i]!;
          const b = p.path[i + 1];
          if (b !== undefined) bannedEdges.add(`${a}>${b}`);
        }
      }
      // 禁用 rootPath 中除 spurNode 外的节点
      const bannedNodes = new Set<string>(rootPath.slice(0, i));
      hooks.onDeviation?.(
        spurNode,
        [...bannedEdges].map((s) => {
          const [f, t] = s.split('>');
          return { from: f!, to: t! };
        }),
      );

      const spur = dijkstra(nodes, edges, spurNode, bannedEdges, bannedNodes);
      const spurPath = reconstruct(spur.prev, spurNode, target);
      if (spurPath === null) continue;
      const totalPath = [...rootPath.slice(0, i), ...spurPath];
      const totalWeight = rw + (spur.dist.get(target) ?? Infinity);
      const key = totalPath.join(',');
      if (!B.has(key) || B.get(key)!.weight > totalWeight) {
        B.set(key, { path: totalPath, weight: totalWeight });
        foundCandidate = true;
      }
    }

    if (!foundCandidate || B.size === 0) break;
    // 取候选中最小者
    let bestKey: string | null = null;
    let bestW = Infinity;
    for (const [key, v] of B) {
      if (v.weight < bestW) {
        bestW = v.weight;
        bestKey = key;
      }
    }
    if (bestKey === null) break;
    const chosen = B.get(bestKey)!;
    B.delete(bestKey);
    A.push(chosen);
    hooks.onPath?.(A.length - 1, chosen.path, chosen.weight);
  }

  hooks.onDone?.(A.length);
  return { paths: A };
}
