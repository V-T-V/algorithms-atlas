// =============================================================================
// 树链剖分（Heavy-Light Decomposition）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 把树剖成若干条「重链」，使任意两点路径只经过 O(log n) 条链，
// 配合线段树/树状数组可做路径/子树查询与修改。
// =============================================================================

/** 树输入（无向边构成一棵树，指定根）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  root: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface HeavyLightHooks {
  /** 第一遍 DFS 访问节点 u：size=子树大小，heavy=重儿子（或 null）。 */
  onDfs1?: (u: string, size: number, heavy: string | null) => void;
  /** 第二遍 DFS 把 u 编入重链：top=链顶，dfn=DFS 序。 */
  onDfs2?: (u: string, top: string, dfn: number) => void;
  /** 一条路径被拆成若干重链段：返回路径上经过的 [dfn 区间] 列表。 */
  onPathSplit?: (u: string, v: string, segs: Array<[number, number]>) => void;
  /** 算法完成。 */
  onDone?: () => void;
}

export interface HeavyLightResult {
  /** 每个节点的重儿子。 */
  heavy: Map<string, string | null>;
  /** 每个节点所在重链的链顶。 */
  top: Map<string, string>;
  /** 每个节点的 DFS 序（1-based）。 */
  dfn: Map<string, number>;
  /** 每个节点的父节点。 */
  parent: Map<string, string | null>;
  /** 每个节点的深度（根为 0）。 */
  depth: Map<string, number>;
  /** dfn(1-based) → 节点（索引 0 占位）。 */
  nodeOfDfn: string[];
}

/**
 * 树链剖分。
 *
 * @param input 树 + 根
 * @param hooks 可选事件钩子
 * @returns 剖分结果
 */
export function heavyLight(input: GraphInput, hooks: HeavyLightHooks = {}): HeavyLightResult {
  const { nodes, edges, root } = input;

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to)) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const size = new Map<string, number>();
  const heavy = new Map<string, string | null>();
  const parent = new Map<string, string | null>();
  const depth = new Map<string, number>();
  const top = new Map<string, string>();
  const dfn = new Map<string, number>();
  const nodeOfDfn: string[] = ['']; // 占位，使 dfn 与下标对齐

  // 第一遍：size、heavy、parent、depth
  const dfs1 = (u: string, p: string | null, d: number): void => {
    parent.set(u, p);
    depth.set(u, d);
    size.set(u, 1);
    heavy.set(u, null);
    let maxSize = 0;
    for (const v of adj.get(u) ?? []) {
      if (v === p) continue;
      dfs1(v, u, d + 1);
      size.set(u, (size.get(u) ?? 0) + (size.get(v) ?? 0));
      if ((size.get(v) ?? 0) > maxSize) {
        maxSize = size.get(v) ?? 0;
        heavy.set(u, v);
      }
    }
    hooks.onDfs1?.(u, size.get(u) ?? 1, heavy.get(u) ?? null);
  };

  // 第二遍：重链顶端、dfn
  let timer = 0;
  const dfs2 = (u: string, t: string): void => {
    timer++;
    dfn.set(u, timer);
    nodeOfDfn.push(u);
    top.set(u, t);
    hooks.onDfs2?.(u, t, timer);
    const h = heavy.get(u);
    if (h !== null) {
      dfs2(h!, t); // 重儿子继承链顶
    }
    for (const v of adj.get(u) ?? []) {
      if (v === parent.get(u) || v === heavy.get(u)) continue;
      dfs2(v, v); // 轻儿子开启新链
    }
  };

  if (nodes.includes(root)) {
    dfs1(root, null, 0);
    dfs2(root, root);
  }

  hooks.onDone?.();
  return { heavy, top, dfn, parent, depth, nodeOfDfn };
}

/**
 * 把 u→v 路径拆成按 dfn 的若干段（每段属于一条重链）。
 * 基于 heavyLight 的剖分结果。
 */
export function splitPath(res: HeavyLightResult, u: string, v: string): Array<[number, number]> {
  const segs: Array<[number, number]> = [];
  let a = u;
  let b = v;
  while (res.top.get(a) !== res.top.get(b)) {
    const ta = res.top.get(a)!;
    const tb = res.top.get(b)!;
    if ((res.depth.get(ta) ?? 0) < (res.depth.get(tb) ?? 0)) {
      segs.push([res.dfn.get(tb)!, res.dfn.get(b)!]);
      b = res.parent.get(tb)!;
    } else {
      segs.push([res.dfn.get(ta)!, res.dfn.get(a)!]);
      a = res.parent.get(ta)!;
    }
  }
  const da = res.dfn.get(a)!;
  const db = res.dfn.get(b)!;
  segs.push([Math.min(da, db), Math.max(da, db)]);
  return segs;
}
