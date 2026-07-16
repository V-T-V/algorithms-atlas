// =============================================================================
// Kosaraju 强连通分量（双 DFS）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 算法：1) 在原图上 DFS，节点结束顺序入栈；2) 在反图上按栈顶序 DFS，每棵树即一个 SCC。
// =============================================================================

/** 图输入（有向图）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface SccKosarajuHooks {
  /** 第一遍 DFS 访问到节点 v（首次）。 */
  onVisit1?: (v: string) => void;
  /** 节点 v 第一遍 DFS 完成，入栈。 */
  onFinish1?: (v: string) => void;
  /** 第二遍 DFS 在反图上从根 root 访问到节点 v。 */
  onVisit2?: (root: string, v: string) => void;
  /** 发现一个 SCC：component 为该分量包含的全部节点。 */
  onComponent?: (component: string[]) => void;
}

export interface SccKosarajuResult {
  components: string[][];
}

/**
 * Kosaraju SCC（有向图）。
 *
 * @param input 图
 * @param hooks 可选事件钩子
 * @returns 所有 SCC 分量
 */
export function sccKosaraju(input: GraphInput, hooks: SccKosarajuHooks = {}): SccKosarajuResult {
  const { nodes, edges } = input;

  const adj = new Map<string, string[]>();
  const radj = new Map<string, string[]>();
  for (const n of nodes) {
    adj.set(n, []);
    radj.set(n, []);
  }
  for (const e of edges) {
    if (adj.has(e.from)) {
      adj.get(e.from)!.push(e.to);
      radj.get(e.to)!.push(e.from);
    }
  }
  for (const list of adj.values()) list.sort();
  for (const list of radj.values()) list.sort();

  const visited = new Set<string>();
  const order: string[] = []; // 完成序

  // 第一遍 DFS（迭代）：完成后入栈
  for (const start of nodes) {
    if (visited.has(start)) continue;
    const st: Array<{ v: string; ei: number }> = [{ v: start, ei: 0 }];
    visited.add(start);
    hooks.onVisit1?.(start);
    while (st.length > 0) {
      const f = st[st.length - 1]!;
      const nbrs = adj.get(f.v) ?? [];
      if (f.ei < nbrs.length) {
        const w = nbrs[f.ei]!;
        f.ei++;
        if (!visited.has(w)) {
          visited.add(w);
          hooks.onVisit1?.(w);
          st.push({ v: w, ei: 0 });
        }
      } else {
        st.pop();
        order.push(f.v);
        hooks.onFinish1?.(f.v);
      }
    }
  }

  // 第二遍：按完成序（栈顶 = order 末尾）在反图上 DFS
  const assigned = new Set<string>();
  const components: string[][] = [];
  for (let i = order.length - 1; i >= 0; i--) {
    const root = order[i]!;
    if (assigned.has(root)) continue;
    const comp: string[] = [];
    const st: string[] = [root];
    assigned.add(root);
    hooks.onVisit2?.(root, root);
    while (st.length > 0) {
      const u = st.pop()!;
      comp.push(u);
      for (const w of radj.get(u) ?? []) {
        if (!assigned.has(w)) {
          assigned.add(w);
          hooks.onVisit2?.(root, w);
          st.push(w);
        }
      }
    }
    components.push(comp);
    hooks.onComponent?.(comp);
  }

  return { components };
}
