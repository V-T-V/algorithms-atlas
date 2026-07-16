// =============================================================================
// 拓扑排序 Topological Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 提供 Kahn（入度法）与 DFS 两种实现；主推 Kahn（可检测环）。
// =============================================================================

/** 有向图输入（与 dijkstra/bfs 保持一致；默认有向）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight?: number }>;
  directed?: boolean;
}

/** Kahn 执行过程中的事件钩子。任一可选。 */
export interface TopoHooks {
  /** 算法开始，报告各节点入度。 */
  onInit?: (inDegree: Map<string, number>) => void;
  /** 一个节点入度为 0，被加入队列。 */
  onEnqueue?: (node: string) => void;
  /** 一个节点出队并输出到拓扑序。 */
  onOutput?: (node: string, position: number) => void;
  /** 删除一条 u→v 的边（使 v 的入度减 1）。 */
  onRemoveEdge?: (from: string, to: string, newInDegree: number) => void;
  /** 完成：是否成功（无环）。 */
  onDone?: (order: string[], hasCycle: boolean) => void;
}

/** 拓扑排序结果。 */
export interface TopoResult {
  /** 拓扑序（若存在环则是不完整序）。 */
  order: string[];
  /** 是否为 DAG（无环）。 */
  isDag: boolean;
}

/** 由 GraphInput 构建有向邻接表与入度表（邻居按 id 升序，保证确定顺序）。 */
function buildDirected(input: GraphInput): {
  adj: Map<string, string[]>;
  inDeg: Map<string, number>;
} {
  const { nodes, edges, directed = true } = input;
  const adj = new Map<string, string[]>();
  const inDeg = new Map<string, number>();
  for (const n of nodes) {
    adj.set(n, []);
    inDeg.set(n, 0);
  }
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
    if (!directed) {
      // 拓扑排序仅对有向图有意义；若输入声明无向，仍按 from→to 计入度
      adj.get(e.to)?.push(e.from);
      inDeg.set(e.from, (inDeg.get(e.from) ?? 0) + 1);
    }
  }
  for (const list of adj.values()) list.sort();
  return { adj, inDeg };
}

/**
 * Kahn 拓扑排序（入度法）。每轮取入度为 0 的节点输出，并删除其出边。
 * 能检测环：若输出节点数 < V 则存在环。
 *
 * @param input 有向图
 * @param hooks 可选事件钩子
 * @returns 拓扑序与是否为 DAG
 */
export function topologicalSort(input: GraphInput, hooks: TopoHooks = {}): TopoResult {
  const { nodes } = input;
  const { adj, inDeg } = buildDirected(input);

  hooks.onInit?.(new Map(inDeg));

  // 初始入度为 0 的节点入队（按 id 升序保证确定）
  const queue: string[] = [];
  for (const n of nodes) {
    if ((inDeg.get(n) ?? 0) === 0) {
      queue.push(n);
      hooks.onEnqueue?.(n);
    }
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    hooks.onOutput?.(u, order.length - 1);
    for (const v of adj.get(u) ?? []) {
      const nd = (inDeg.get(v) ?? 0) - 1;
      inDeg.set(v, nd);
      hooks.onRemoveEdge?.(u, v, nd);
      if (nd === 0) {
        queue.push(v);
        hooks.onEnqueue?.(v);
      }
    }
  }

  const isDag = order.length === nodes.length;
  hooks.onDone?.(order, !isDag);
  return { order, isDag };
}

/**
 * DFS 拓扑排序（后序逆序）。访问完一个节点的所有后继后再将其压栈。
 * 仅当图为 DAG 时结果有效；存在环时返回的序不完整/含环。
 *
 * @param input 有向图
 * @returns 拓扑序（后序逆序）
 */
export function topologicalSortDfs(input: GraphInput): TopoResult {
  const { nodes } = input;
  const { adj } = buildDirected(input);
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<string, number>(nodes.map((n) => [n, WHITE]));
  const stack: string[] = [];
  let hasCycle = false;

  const visit = (u: string): void => {
    if (hasCycle) return;
    color.set(u, GRAY);
    for (const v of adj.get(u) ?? []) {
      const c = color.get(v) ?? WHITE;
      if (c === GRAY) {
        hasCycle = true; // 回边 → 环
        return;
      }
      if (c === WHITE) visit(v);
      if (hasCycle) return;
    }
    color.set(u, BLACK);
    stack.push(u);
  };

  for (const n of nodes) {
    if ((color.get(n) ?? WHITE) === WHITE) visit(n);
    if (hasCycle) break;
  }

  stack.reverse();
  return { order: stack, isDag: !hasCycle && stack.length === nodes.length };
}
