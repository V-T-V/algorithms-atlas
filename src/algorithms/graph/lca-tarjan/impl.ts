// =============================================================================
// LCA · Tarjan 离线（并查集）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 算法：一次 DFS，访问完某子树后用并查集把该子树并到根；
//       当节点 u 已处理完，回答所有「另一端 v 也已访问」的询问，LCA = find(v)。
// =============================================================================

/** 树输入（无向边构成一棵树，指定根）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  root: string;
}

/** 一条 LCA 询问。 */
export interface LcaQuery {
  u: string;
  v: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface LcaTarjanHooks {
  /** 首次访问节点 u。 */
  onVisit?: (u: string) => void;
  /** 把子树 child 并到父 par。 */
  onUnion?: (par: string, child: string) => void;
  /** 回答询问 (u,v) 的 LCA = lca。 */
  onAnswer?: (u: string, v: string, lca: string) => void;
}

export interface LcaTarjanResult {
  /** 每条询问的 LCA（按输入顺序）。 */
  answers: string[];
}

/** 并查集（带路径压缩）。 */
class DSU {
  parent: Map<string, string>;
  constructor() {
    this.parent = new Map();
  }
  makeSet(x: string): void {
    if (!this.parent.has(x)) this.parent.set(x, x);
  }
  find(x: string): string {
    let cur = x;
    while (this.parent.get(cur) !== cur) cur = this.parent.get(cur)!;
    let p = x;
    while (this.parent.get(p) !== cur) {
      const nxt = this.parent.get(p)!;
      this.parent.set(p, cur);
      p = nxt;
    }
    return cur;
  }
  union(child: string, par: string): void {
    this.parent.set(this.find(child), this.find(par));
  }
}

/**
 * Tarjan 离线 LCA。
 *
 * @param tree 树
 * @param queries 询问列表
 * @param hooks 可选事件钩子
 * @returns 每条询问的 LCA
 */
export function lcaTarjan(
  tree: GraphInput,
  queries: readonly LcaQuery[],
  hooks: LcaTarjanHooks = {},
): LcaTarjanResult {
  const { nodes, edges, root } = tree;

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to)) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  // 每个节点挂的询问：[对端节点, 询问下标]
  const queryMap = new Map<string, Array<[string, number]>>();
  queries.forEach((q, i) => {
    if (!queryMap.has(q.u)) queryMap.set(q.u, []);
    if (!queryMap.has(q.v)) queryMap.set(q.v, []);
    queryMap.get(q.u)!.push([q.v, i]);
    queryMap.get(q.v)!.push([q.u, i]);
  });

  const dsu = new DSU();
  for (const n of nodes) dsu.makeSet(n);
  const visited = new Set<string>();
  const ancestor = new Map<string, string>(); // 每个集合的「代表祖先」
  const answers: string[] = new Array(queries.length).fill('');

  const dfs = (u: string, par: string | null): void => {
    hooks.onVisit?.(u);
    ancestor.set(u, u);
    for (const v of adj.get(u) ?? []) {
      if (v === par) continue;
      dfs(v, u);
      dsu.union(v, u);
      ancestor.set(dsu.find(u), u);
      hooks.onUnion?.(u, v);
    }
    visited.add(u);
    // 回答询问
    for (const [other, idx] of queryMap.get(u) ?? []) {
      if (visited.has(other)) {
        const l = ancestor.get(dsu.find(other)) ?? other;
        answers[idx] = l;
        hooks.onAnswer?.(u, other, l);
      }
    }
  };

  if (nodes.includes(root)) dfs(root, null);

  return { answers };
}
