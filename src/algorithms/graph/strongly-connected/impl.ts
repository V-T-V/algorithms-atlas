// =============================================================================
// 强连通分量（Strongly Connected Components）· Kosaraju 算法 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 核心：两次 DFS。
//   1) 在原图 G 上 DFS，节点按「完成时间」入栈（完成序）。
//   2) 在反图 G^T 上按栈顶（完成最晚）到栈底的顺序 DFS，每次搜到的连通块即一个 SCC。
// =============================================================================

/** 有向图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface KosarajuHooks {
  /** 第一次 DFS 访问节点 v（原图）。 */
  onFinish?: (v: string) => void;
  /** 第二次 DFS 在反图上以种子 seed 开始搜索一个新 SCC。 */
  onComponentStart?: (seed: string) => void;
  /** 收集到一个 SCC：component 为该分量节点列表。 */
  onComponent?: (component: string[]) => void;
}

/** 结果：所有 SCC 分量（每个为节点 id 列表）。 */
export interface KosarajuResult {
  components: string[][];
}

/** 在某图（邻接表 adj）上做迭代 DFS，收集从 start 可达的未访问节点（visit 标记）。 */
function dfsCollect(
  adj: Map<string, string[]>,
  start: string,
  visited: Set<string>,
  onNode?: (v: string) => void,
): string[] {
  const collected: string[] = [];
  const stack: Array<{ node: string; ei: number }> = [{ node: start, ei: 0 }];
  visited.add(start);
  while (stack.length > 0) {
    const top = stack[stack.length - 1]!;
    const neighbors = adj.get(top.node) ?? [];
    if (top.ei < neighbors.length) {
      const w = neighbors[top.ei]!;
      top.ei++;
      if (!visited.has(w)) {
        visited.add(w);
        stack.push({ node: w, ei: 0 });
      }
    } else {
      collected.push(top.node);
      onNode?.(top.node);
      stack.pop();
    }
  }
  return collected;
}

/**
 * Kosaraju 强连通分量（有向图，两次 DFS）。
 *
 * @param input 有向图
 * @param hooks 可选事件钩子
 * @returns 所有 SCC 分量（按反图 DFS 的发现顺序）
 */
export function stronglyConnected(input: GraphInput, hooks: KosarajuHooks = {}): KosarajuResult {
  const { nodes, edges } = input;

  // 原图与反图邻接表（邻居按 id 升序，保证遍历顺序确定）
  const adj = new Map<string, string[]>();
  const radj = new Map<string, string[]>();
  for (const n of nodes) {
    adj.set(n, []);
    radj.set(n, []);
  }
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (radj.has(e.to)) radj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();
  for (const list of radj.values()) list.sort();

  // 第一次 DFS：原图，按完成序入栈
  const visited = new Set<string>();
  const finishStack: string[] = []; // 完成序：栈顶为最晚完成
  for (const n of nodes) {
    if (!visited.has(n)) {
      dfsCollect(adj, n, visited, (v) => {
        finishStack.push(v);
        hooks.onFinish?.(v);
      });
    }
  }

  // 第二次 DFS：反图，按完成序（栈顶到栈底）逐个种子
  const visited2 = new Set<string>();
  const components: string[][] = [];
  while (finishStack.length > 0) {
    const seed = finishStack.pop()!;
    if (visited2.has(seed)) continue;
    hooks.onComponentStart?.(seed);
    const comp = dfsCollect(radj, seed, visited2);
    components.push(comp);
    hooks.onComponent?.(comp);
  }

  return { components };
}
