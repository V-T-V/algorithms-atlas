// =============================================================================
// 二分图判定（染色法）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// BFS/DFS 给每个连通分量染两种颜色（0/1），相邻同色即非二分图。
// =============================================================================

/** 无向图输入。 */
export interface BipartiteCheckInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 染色过程中的事件钩子。任一可选。 */
export interface BipartiteCheckHooks {
  /** 开始处理一个新连通分量，以 source 为根。 */
  onComponentStart?: (source: string) => void;
  /** 给节点染色（color ∈ {0,1}）。 */
  onColor?: (node: string, color: number) => void;
  /** 检查边 (u,v)：conflict 表示是否发现同色冲突。 */
  onExamineEdge?: (u: string, v: string, conflict: boolean) => void;
  /** 算法完成：是否为二分图，以及每个节点的颜色（null 表示未染色/冲突前）。 */
  onDone?: (bipartite: boolean, colors: Map<string, number>) => void;
}

/** 二分图判定结果。 */
export interface BipartiteCheckResult {
  bipartite: boolean;
  /** 节点 → 颜色 {0,1}；非二分图时为冲突前的部分着色。 */
  colors: Map<string, number>;
  /** 首个发现冲突的边（若有）。 */
  conflictEdge: { from: string; to: string } | null;
}

/**
 * 染色法判定二分图（BFS）。
 *
 * @param input 无向图
 * @param hooks 可选事件钩子
 * @returns 是否二分图、各点颜色、冲突边
 */
export function bipartiteCheck(
  input: BipartiteCheckInput,
  hooks: BipartiteCheckHooks = {},
): BipartiteCheckResult {
  const { nodes, edges } = input;

  // 邻接表（无向：双向加边）
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (!adj.has(e.from) || !adj.has(e.to)) continue;
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  const color = new Map<string, number>(); // 0 / 1
  let conflictEdge: { from: string; to: string } | null = null;
  let bipartite = true;

  for (const start of nodes) {
    if (color.has(start)) continue;
    hooks.onComponentStart?.(start);
    color.set(start, 0);
    hooks.onColor?.(start, 0);
    const queue: string[] = [start];
    let head = 0;
    while (head < queue.length && bipartite) {
      const u = queue[head]!;
      head++;
      const cu = color.get(u)!;
      for (const v of adj.get(u) ?? []) {
        if (!color.has(v)) {
          color.set(v, 1 - cu);
          hooks.onColor?.(v, 1 - cu);
          queue.push(v);
          hooks.onExamineEdge?.(u, v, false);
        } else {
          const conflict = color.get(v) === cu;
          hooks.onExamineEdge?.(u, v, conflict);
          if (conflict) {
            bipartite = false;
            conflictEdge = { from: u, to: v };
            break;
          }
        }
      }
    }
    if (!bipartite) break;
  }

  hooks.onDone?.(bipartite, color);
  return { bipartite, colors: color, conflictEdge };
}
