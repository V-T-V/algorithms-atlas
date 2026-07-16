// =============================================================================
// 树链剖分（Heavy-Light Decomposition）· 完整实现
// 两遍 DFS：dfs1 求 size/depth/parent/heavy；dfs2 求 top/dfn/rnk。
// 提供路径分解 helper：把路径 (u,v) 拆成 O(log V) 个连续区间。
// =============================================================================

export interface TreeInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  root?: string;
}

export interface HldHooks {
  onDfs1?: (v: string, size: number, heavy: string | null) => void;
  onDfs2?: (v: string, top: string, dfn: number) => void;
  onResult?: (info: HldInfo) => void;
}

export interface Range {
  lo: number;
  hi: number;
}

export interface HldInfo {
  parent: Map<string, string | null>;
  depth: Map<string, number>;
  size: Map<string, number>;
  heavy: Map<string, string | null>;
  top: Map<string, string>;
  /** dfn：节点 -> 1-based 时间戳。 */
  dfn: Map<string, number>;
  /** rnk：时间戳 -> 节点（dfn 的逆）。 */
  rnk: string[];
}

export function heavyLightDecomposition(input: TreeInput, hooks: HldHooks = {}): HldInfo {
  const { nodes, edges } = input;
  const root = input.root ?? nodes[0] ?? '';

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to)) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const parent = new Map<string, string | null>();
  const depth = new Map<string, number>();
  const size = new Map<string, number>();
  const heavy = new Map<string, string | null>();
  for (const n of nodes) heavy.set(n, null);

  // dfs1（迭代）：求 size/depth/parent/heavy
  const order: string[] = [];
  const visited = new Set<string>();
  parent.set(root, null);
  depth.set(root, 0);
  {
    const st: string[] = [root];
    while (st.length > 0) {
      const u = st.pop()!;
      if (visited.has(u)) continue;
      visited.add(u);
      order.push(u);
      for (const v of adj.get(u) ?? []) {
        if (visited.has(v)) continue;
        parent.set(v, u);
        depth.set(v, (depth.get(u) ?? 0) + 1);
        st.push(v);
      }
    }
  }
  // 逆序累加 size 并定 heavy
  for (const n of nodes) size.set(n, 1);
  for (let i = order.length - 1; i >= 0; i--) {
    const u = order[i]!;
    let maxSub = 0;
    let hv: string | null = null;
    for (const v of adj.get(u) ?? []) {
      if (v === parent.get(u)) continue;
      const sv = size.get(v) ?? 0;
      size.set(u, (size.get(u) ?? 0) + sv);
      if (sv > maxSub) {
        maxSub = sv;
        hv = v;
      }
    }
    heavy.set(u, hv);
    hooks.onDfs1?.(u, size.get(u) ?? 0, hv);
  }

  // dfs2（迭代）：top / dfn / rnk，先重后轻
  const top = new Map<string, string>();
  const dfn = new Map<string, number>();
  const rnk: string[] = [];
  let timer = 0;
  {
    interface F {
      v: string;
      t: string;
    }
    const st: F[] = [{ v: root, t: root }];
    while (st.length > 0) {
      const { v, t } = st.pop()!;
      timer++;
      dfn.set(v, timer);
      rnk.push(v);
      top.set(v, t);
      hooks.onDfs2?.(v, t, timer);
      const hv = heavy.get(v);
      const children: string[] = [];
      for (const c of adj.get(v) ?? []) {
        if (c === parent.get(v)) continue;
        children.push(c);
      }
      // 先压轻儿子，再压重儿子（保证重儿子先弹出处理 = 链连续）
      for (const c of children) {
        if (c === hv) continue;
        st.push({ v: c, t: c });
      }
      if (hv) st.push({ v: hv, t });
    }
  }

  const info: HldInfo = { parent, depth, size, heavy, top, dfn, rnk };
  hooks.onResult?.(info);
  return info;
}

/** 把 u→v 路径拆成 O(log V) 个连续区间（按 dfn）。
 *  返回若干 [lo, hi]，每个对应一条重链上的一段。 */
export function decomposePath(info: HldInfo, u: string, v: string): Range[] {
  const { top, depth, dfn, parent } = info;
  const ranges: Range[] = [];
  let a = u;
  let b = v;
  while (top.get(a) !== top.get(b)) {
    const ta = top.get(a)!;
    const tb = top.get(b)!;
    if ((depth.get(ta) ?? 0) >= (depth.get(tb) ?? 0)) {
      // a 所在链顶更深或同深，跳 a
      ranges.push({ lo: dfn.get(ta)!, hi: dfn.get(a)! });
      a = parent.get(ta) ?? a;
    } else {
      ranges.push({ lo: dfn.get(tb)!, hi: dfn.get(b)! });
      b = parent.get(tb) ?? b;
    }
  }
  // 同链
  const da = dfn.get(a)!;
  const db = dfn.get(b)!;
  ranges.push({ lo: Math.min(da, db), hi: Math.max(da, db) });
  return ranges;
}
