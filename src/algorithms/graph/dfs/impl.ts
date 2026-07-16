// =============================================================================
// 深度优先搜索 Depth-First Search · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 加权/无权图的通用输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight?: number }>;
  directed?: boolean;
}

/** 由 GraphInput 构建邻接表（邻居按 id 升序，保证遍历顺序确定）。 */
export function buildAdjacency(input: GraphInput): Map<string, string[]> {
  const { nodes, edges, directed = false } = input;
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    if (!directed) adj.get(e.to)?.push(e.from);
  }
  for (const list of adj.values()) list.sort();
  return adj;
}

/** DFS 执行过程中的事件钩子。任一可选。 */
export interface DfsHooks {
  /** 首次进入节点；parent 为 null 表示起点/孤立足点。 */
  onDiscover?: (node: string, parent: string | null) => void;
  /** 节点的所有子树处理完毕，回溯离开。 */
  onLeave?: (node: string) => void;
  /** 检查一条边 from→to（无论 to 是否已被访问）。 */
  onExamine?: (from: string, to: string) => void;
}

/**
 * 深度优先搜索（递归实现，确定顺序）。
 * 从 start 出发，尽可能深入，遇到死路则回溯。返回先序访问顺序。
 *
 * @param input 图
 * @param start 起点
 * @param hooks 可选事件钩子
 * @returns 先序访问顺序数组（仅可达节点）
 */
export function dfs(input: GraphInput, start: string, hooks: DfsHooks = {}): string[] {
  const adj = buildAdjacency(input);
  if (!adj.has(start)) return [];

  const visited = new Set<string>();
  const order: string[] = [];

  const visit = (u: string, parent: string | null): void => {
    visited.add(u);
    order.push(u);
    hooks.onDiscover?.(u, parent);
    for (const v of adj.get(u) ?? []) {
      hooks.onExamine?.(u, v);
      if (!visited.has(v)) visit(v, u);
    }
    hooks.onLeave?.(u);
  };

  visit(start, null);
  return order;
}
