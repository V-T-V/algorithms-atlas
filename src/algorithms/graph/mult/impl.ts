// =============================================================================
// 倍增 LCA（Binary Lifting）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 预处理 up[k][u] = u 上跳 2^k 步到的祖先；查询时先把深者提到同深，再二分上跳。
// =============================================================================

/** 树输入（无向边构成一棵树，指定根）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  root: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface MultHooks {
  /** BFS/DFS 访问节点 u：depth=深度，parent=父。 */
  onVisit?: (u: string, depth: number, parent: string | null) => void;
  /** 倍增表构建完成（levels = log 层数）。 */
  onTableBuilt?: (levels: number) => void;
  /** 上跳：从 u 上跳 2^k 步到 anc。 */
  onLift?: (u: string, k: number, anc: string | null) => void;
  /** 回答询问 (u,v) 的 LCA。 */
  onAnswer?: (u: string, v: string, lca: string) => void;
}

export interface MultResult {
  /** 回答 LCA 询问。 */
  query: (u: string, v: string) => string;
  /** 每节点深度。 */
  depth: Map<string, number>;
  /** 倍增层数。 */
  levels: number;
}

/**
 * 倍增 LCA 预处理 + 在线查询。
 *
 * @param input 树
 * @param hooks 可选事件钩子
 * @returns 含 query 的结果
 */
export function mult(input: GraphInput, hooks: MultHooks = {}): MultResult {
  const { nodes, edges, root } = input;

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to)) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const depth = new Map<string, number>();
  const LOG = Math.max(1, Math.ceil(Math.log2(Math.max(2, nodes.length)) + 1));
  const up: Array<Map<string, string | null>> = [];
  for (let i = 0; i <= LOG; i++) up.push(new Map());

  // BFS 求深度与父
  if (nodes.includes(root)) {
    depth.set(root, 0);
    up[0]!.set(root, null);
    const queue = [root];
    const seen = new Set<string>([root]);
    while (queue.length > 0) {
      const u = queue.shift()!;
      hooks.onVisit?.(u, depth.get(u) ?? 0, up[0]!.get(u) ?? null);
      for (const v of adj.get(u) ?? []) {
        if (seen.has(v)) continue;
        seen.add(v);
        depth.set(v, (depth.get(u) ?? 0) + 1);
        up[0]!.set(v, u);
        queue.push(v);
      }
    }
  }

  // 倍增
  for (let k = 1; k <= LOG; k++) {
    for (const n of nodes) {
      const mid = up[k - 1]!.get(n) ?? null;
      up[k]!.set(n, mid === null ? null : (up[k - 1]!.get(mid) ?? null));
    }
  }
  hooks.onTableBuilt?.(LOG);

  const lift = (u: string, steps: number): string => {
    let cur = u;
    for (let k = LOG; k >= 0; k--) {
      if (((steps >> k) & 1) === 1) {
        const anc = up[k]!.get(cur) ?? null;
        hooks.onLift?.(cur, k, anc);
        if (anc === null) return cur;
        cur = anc;
      }
    }
    return cur;
  };

  const query = (u: string, v: string): string => {
    if (!depth.has(u) || !depth.has(v)) return '';
    let a = u;
    let b = v;
    if ((depth.get(a) ?? 0) < (depth.get(b) ?? 0)) [a, b] = [b, a];
    // 提到同深
    a = lift(a, (depth.get(a) ?? 0) - (depth.get(b) ?? 0));
    if (a === b) {
      hooks.onAnswer?.(u, v, a);
      return a;
    }
    for (let k = LOG; k >= 0; k--) {
      const ua = up[k]!.get(a) ?? null;
      const ub = up[k]!.get(b) ?? null;
      if (ua !== ub) {
        a = ua ?? a;
        b = ub ?? b;
      }
    }
    const res = up[0]!.get(a) ?? a;
    hooks.onAnswer?.(u, v, res);
    return res;
  };

  return { query, depth, levels: LOG };
}
