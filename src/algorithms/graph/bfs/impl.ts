// =============================================================================
// 广度优先搜索 Breadth-First Search · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 加权/无权图的通用输入。 */
export interface GraphInput {
  /** 节点 id 列表。 */
  nodes: readonly string[];
  /** 边列表；weight 在无权图中可省略。 */
  edges: ReadonlyArray<{ from: string; to: string; weight?: number }>;
  /** 是否有向，默认 false。 */
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

/** BFS 执行过程中的事件钩子。任一可选。 */
export interface BfsHooks {
  /** 节点首次被发现并入队；parent 为 null 表示起点。 */
  onDiscover?: (node: string, parent: string | null) => void;
  /** 节点出队并被访问（展开邻居）。 */
  onVisit?: (node: string) => void;
  /** 检查一条边 from→to（无论 to 是否已被访问）。 */
  onExamine?: (from: string, to: string) => void;
}

/**
 * 广度优先搜索（单源）。从 start 出发，按「层」逐层扩展，
 * 返回可达节点的访问顺序。不可达节点不出现。
 *
 * @param input 图
 * @param start 起点
 * @param hooks 可选事件钩子
 * @returns 访问顺序数组
 */
export function bfs(input: GraphInput, start: string, hooks: BfsHooks = {}): string[] {
  const adj = buildAdjacency(input);
  if (!adj.has(start)) return [];

  const visited = new Set<string>([start]);
  const order: string[] = [];
  const queue: string[] = [start];
  hooks.onDiscover?.(start, null);

  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    hooks.onVisit?.(u);
    for (const v of adj.get(u) ?? []) {
      hooks.onExamine?.(u, v);
      if (!visited.has(v)) {
        visited.add(v);
        hooks.onDiscover?.(v, u);
        queue.push(v);
      }
    }
  }
  return order;
}
