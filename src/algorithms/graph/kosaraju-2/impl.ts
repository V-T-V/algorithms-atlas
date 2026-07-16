// =============================================================================
// Kosaraju 强连通分量（两次 DFS）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 算法：1) 在原图上 DFS，节点完成时压栈；2) 按出栈顺序在反图上 DFS，每棵树即一个 SCC。
// =============================================================================

/** 图输入（有向图）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface Kosaraju2Hooks {
  /** 第一遍 DFS 访问节点 v。 */
  onVisit1?: (v: string) => void;
  /** 第一遍 DFS 完成节点 v（压入完成栈）。 */
  onFinish1?: (v: string) => void;
  /** 第二遍（反图）DFS 访问节点 v。 */
  onVisit2?: (v: string) => void;
  /** 发现一个 SCC：component 为该分量包含的全部节点。 */
  onComponent?: (component: string[]) => void;
}

export interface Kosaraju2Result {
  components: string[][];
}

/**
 * Kosaraju 强连通分量（有向图，两遍 DFS）。
 *
 * @param input 图
 * @param hooks 可选事件钩子
 * @returns 所有 SCC 分量
 */
export function kosaraju2(input: GraphInput, hooks: Kosaraju2Hooks = {}): Kosaraju2Result {
  const { nodes, edges } = input;

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

  const visited = new Set<string>();
  const order: string[] = []; // 完成序（出栈顺序）

  // 第一遍：原图 DFS，记录完成序
  const dfs1 = (start: string): void => {
    const stack: Array<{ v: string; ei: number }> = [{ v: start, ei: 0 }];
    visited.add(start);
    hooks.onVisit1?.(start);
    while (stack.length > 0) {
      const f = stack[stack.length - 1]!;
      const ns = adj.get(f.v) ?? [];
      if (f.ei < ns.length) {
        const w = ns[f.ei]!;
        f.ei++;
        if (!visited.has(w)) {
          visited.add(w);
          hooks.onVisit1?.(w);
          stack.push({ v: w, ei: 0 });
        }
      } else {
        stack.pop();
        order.push(f.v);
        hooks.onFinish1?.(f.v);
      }
    }
  };

  for (const n of nodes) {
    if (!visited.has(n)) dfs1(n);
  }

  // 第二遍：按完成序逆序在反图 DFS
  const assigned = new Set<string>();
  const components: string[][] = [];

  const dfs2 = (start: string): string[] => {
    const comp: string[] = [];
    const stack = [start];
    assigned.add(start);
    hooks.onVisit2?.(start);
    while (stack.length > 0) {
      const u = stack.pop()!;
      comp.push(u);
      for (const w of radj.get(u) ?? []) {
        if (!assigned.has(w)) {
          assigned.add(w);
          hooks.onVisit2?.(w);
          stack.push(w);
        }
      }
    }
    return comp;
  };

  for (let i = order.length - 1; i >= 0; i--) {
    const v = order[i]!;
    if (!assigned.has(v)) {
      const comp = dfs2(v);
      components.push(comp);
      hooks.onComponent?.(comp);
    }
  }

  return { components };
}
