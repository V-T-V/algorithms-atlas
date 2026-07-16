// =============================================================================
// 树链剖分（重链剖分）· 纯算法实现
// =============================================================================

export interface HldHooks {
  onDfs1?: (u: number, size: number, heavy: number) => void;
  onDfs2?: (u: number, top: number, dfn: number) => void;
  onChainJump?: (u: number, top: number) => void;
  onResult?: (lca: number) => void;
}

export interface HldOptions {
  /** 0-based 节点编号。 */
  n: number;
  /** 无向边列表。 */
  edges: Array<[number, number]>;
  /** 根节点。 */
  root: number;
}

export class HeavyLightDecomposition {
  n: number;
  root: number;
  adj: number[][];
  parent: number[];
  depth: number[];
  size: number[];
  heavy: number[]; // 重儿子，-1 表示无
  top: number[]; // 所在重链顶部
  dfn: number[]; // DFS 序
  rank: number[]; // dfn → 节点
  private hooks: HldHooks;

  constructor(opts: HldOptions, hooks: HldHooks = {}) {
    this.n = opts.n;
    this.root = opts.root;
    this.hooks = hooks;
    this.adj = Array.from({ length: opts.n }, () => []);
    this.parent = new Array<number>(opts.n).fill(-1);
    this.depth = new Array<number>(opts.n).fill(0);
    this.size = new Array<number>(opts.n).fill(0);
    this.heavy = new Array<number>(opts.n).fill(-1);
    this.top = new Array<number>(opts.n).fill(0);
    this.dfn = new Array<number>(opts.n).fill(0);
    this.rank = new Array<number>(opts.n).fill(0);
    for (const [u, v] of opts.edges) {
      this.adj[u]!.push(v);
      this.adj[v]!.push(u);
    }
    this.build();
  }

  private build(): void {
    // 第一遍 DFS：size、depth、heavy
    const dfs1 = (u: number, p: number, d: number): void => {
      this.parent[u] = p;
      this.depth[u] = d;
      this.size[u] = 1;
      let maxSize = 0;
      for (const v of this.adj[u]!) {
        if (v === p) continue;
        dfs1(v, u, d + 1);
        this.size[u]! += this.size[v]!;
        if (this.size[v]! > maxSize) {
          maxSize = this.size[v]!;
          this.heavy[u] = v;
        }
      }
      this.hooks.onDfs1?.(u, this.size[u]!, this.heavy[u]!);
    };
    dfs1(this.root, -1, 0);

    // 第二遍 DFS：top、dfn
    let timer = 0;
    const dfs2 = (u: number, t: number): void => {
      this.top[u] = t;
      this.dfn[u] = timer;
      this.rank[timer] = u;
      timer++;
      this.hooks.onDfs2?.(u, t, this.dfn[u]!);
      // 先走重儿子，保持重链 dfn 连续
      if (this.heavy[u] !== -1) dfs2(this.heavy[u]!, t);
      for (const v of this.adj[u]!) {
        if (v === this.parent[u] || v === this.heavy[u]) continue;
        dfs2(v, v); // 轻儿子开新链
      }
    };
    dfs2(this.root, this.root);
  }

  /** 求 u、v 的最近公共祖先（LCA）。 */
  lca(u: number, v: number): number {
    while (this.top[u] !== this.top[v]) {
      if (this.depth[this.top[u]!]! < this.depth[this.top[v]!]!) {
        [u, v] = [v, u];
      }
      this.hooks.onChainJump?.(u, this.top[u]!);
      u = this.parent[this.top[u]!]!;
    }
    const result = this.depth[u]! < this.depth[v]! ? u : v;
    this.hooks.onResult?.(result);
    return result;
  }

  /** 路径 u→v 上经过的重链段数（链段数量）。 */
  pathChainCount(u: number, v: number): number {
    let count = 0;
    while (this.top[u] !== this.top[v]) {
      if (this.depth[this.top[u]!]! < this.depth[this.top[v]!]!) [u, v] = [v, u];
      count++;
      u = this.parent[this.top[u]!]!;
    }
    return count + 1; // 最后一段
  }
}
