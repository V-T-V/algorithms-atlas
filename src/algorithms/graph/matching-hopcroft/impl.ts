// =============================================================================
// Hopcroft-Karp 二分图最大匹配 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 核心：反复 BFS 构建交替路分层图（给未匹配左点到所有未匹配右点的最短交替路分层），
//      再用 DFS 在该分层图上找多条**点不相交**的最短增广路并行增广，直到无增广路。
// =============================================================================

/** 二分图输入：左部点集 U、右部点集 V、无向边集合（u-v）。 */
export interface BipartiteInput {
  left: readonly string[];
  right: readonly string[];
  edges: ReadonlyArray<{ left: string; right: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface HopcroftKarpHooks {
  /** 开始一轮 BFS 分层。 */
  onPhase?: (phase: number) => void;
  /** BFS 分层完成：dist 为各左点的层（Infinity 表示本轮不可达）。 */
  onLayer?: (dist: Map<string, number>) => void;
  /** DFS 从左点 u 出发找到一条增广路（路径上的右点序列）。 */
  onAugment?: (u: string, path: string[]) => void;
  /** 一对 (u, v) 形成匹配。 */
  onMatch?: (u: string, v: string) => void;
  /** 本轮结束，本轮新增的匹配数。 */
  onPhaseDone?: (augmented: number) => void;
  /** 算法结束：最大匹配数。 */
  onDone?: (size: number) => void;
}

/** 结果：最大匹配数 + 匹配配对。 */
export interface HopcroftKarpResult {
  /** 最大匹配大小。 */
  size: number;
  /** left→right 的匹配映射。 */
  matchLeft: Map<string, string>;
  /** right→left 的匹配映射。 */
  matchRight: Map<string, string>;
}

const INF = Infinity;

/**
 * Hopcroft-Karp 二分图最大匹配。
 *
 * 每个阶段：\n- BFS：从所有未匹配左点同时出发，沿「未匹配边→匹配边→…」交替前进，
 *   给左点赋层 dist[u]；当首次到达某未匹配右点即得到最短增广路长度\n- DFS：每个未匹配左点在分层图上找一条到未匹配右点的路径并行增广\n
 * 复杂度 `O(E·√V)`。
 *
 * @param input 二分图
 * @param hooks 可选事件钩子
 */
export function matchingHopcroft(
  input: BipartiteInput,
  hooks: HopcroftKarpHooks = {},
): HopcroftKarpResult {
  const { left, right, edges } = input;

  const adj = new Map<string, string[]>(); // 左点 → 邻接右点
  for (const u of left) adj.set(u, []);
  for (const e of edges) {
    if (adj.has(e.left)) adj.get(e.left)!.push(e.right);
  }
  for (const list of adj.values()) list.sort();

  const matchLeft = new Map<string, string>(); // u -> v
  const matchRight = new Map<string, string>(); // v -> u
  const dist = new Map<string, number>();

  /** BFS 构建分层图，返回是否存在增广路（即是否有未匹配左点能到达未匹配右点）。 */
  const bfs = (): boolean => {
    const queue: string[] = [];
    for (const u of left) {
      if (!matchLeft.has(u)) {
        dist.set(u, 0);
        queue.push(u);
      } else {
        dist.set(u, INF);
      }
    }
    let found = false;
    while (queue.length > 0) {
      const u = queue.shift()!;
      const du = dist.get(u) ?? INF;
      for (const v of adj.get(u) ?? []) {
        const mu = matchRight.get(v); // v 的匹配左点
        if (mu === undefined) {
          // v 未匹配：到达终点层
          found = true;
        } else {
          const mdu = dist.get(mu) ?? INF;
          if (mdu === INF) {
            dist.set(mu, du + 1);
            queue.push(mu);
          }
        }
      }
    }
    return found;
  };

  /** DFS 在分层图上从 u 出发找增广路，成功返回 true。 */
  const dfs = (u: string): boolean => {
    const du = dist.get(u) ?? INF;
    for (const v of adj.get(u) ?? []) {
      const mu = matchRight.get(v);
      if (mu === undefined) {
        // 到未匹配右点：可增广（必须在最短层）
        if ((dist.get(u) ?? INF) !== INF) {
          matchLeft.set(u, v);
          matchRight.set(v, u);
          hooks.onMatch?.(u, v);
          return true;
        }
      } else {
        const mdu = dist.get(mu) ?? INF;
        if (mdu === du + 1) {
          if (dfs(mu)) {
            matchLeft.set(u, v);
            matchRight.set(v, u);
            hooks.onMatch?.(u, v);
            return true;
          }
        }
      }
    }
    dist.set(u, INF); // 标记本阶段不再尝试
    return false;
  };

  let size = 0;
  let phase = 0;
  while (true) {
    phase++;
    hooks.onPhase?.(phase);
    const hasAug = bfs();
    hooks.onLayer?.(new Map(dist));
    if (!hasAug) break;
    let augmented = 0;
    for (const u of left) {
      if (!matchLeft.has(u)) {
        // 记录增广路径
        const before = new Map(matchRight);
        if (dfs(u)) {
          augmented++;
          size++;
          // 推断本轮新增/改变的右点序列作为路径（简化展示）
          const path: string[] = [];
          for (const v of right) {
            if (matchRight.get(v) !== before.get(v) && matchRight.get(v) !== undefined) {
              path.push(v);
            }
          }
          hooks.onAugment?.(u, path);
        }
      }
    }
    hooks.onPhaseDone?.(augmented);
    if (augmented === 0) break;
  }

  hooks.onDone?.(size);
  return { size, matchLeft, matchRight };
}
