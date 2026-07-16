// =============================================================================
// 虚树（Virtual Tree）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 给定一棵原树与一组「关键点」，构造仅含这些点及其两两 LCA 的虚树，
// 保持原树的祖先结构，规模为 O(k)（k=关键点数）。
// =============================================================================

/** 树输入（无向边构成一棵树，指定根）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  root: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface VirtualTreeHooks {
  /** 计算 DFS 序：访问节点 u，dfn 为其序号。 */
  onDfs?: (u: string, dfn: number) => void;
  /** 求两个节点的 LCA。 */
  onLca?: (a: string, b: string, lca: string) => void;
  /** 把节点 v 加入虚树（可能是关键点或 LCA）。 */
  onAddVertex?: (v: string) => void;
  /** 在虚树中连接父 par → 子 child。 */
  onTreeEdge?: (par: string, child: string) => void;
  /** 算法完成：虚树边数。 */
  onDone?: (edgeCount: number) => void;
}

export interface VirtualTreeResult {
  /** 虚树包含的节点（关键点 + 必要的 LCA）。 */
  vertices: string[];
  /** 虚树的边 [par, child]。 */
  edges: Array<[string, string]>;
  /** 虚树中每个节点的父。 */
  parent: Map<string, string | null>;
}

/**
 * 构造关键点集的虚树。
 *
 * @param tree 原树
 * @param keyVertices 关键点集合
 * @param hooks 可选事件钩子
 * @returns 虚树
 */
export function virtualTree(
  tree: GraphInput,
  keyVertices: readonly string[],
  hooks: VirtualTreeHooks = {},
): VirtualTreeResult {
  const { nodes, edges, root } = tree;

  // 邻接表
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to)) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const dfn = new Map<string, number>();
  const depth = new Map<string, number>();
  const parent = new Map<string, string | null>();
  const LOG = Math.max(1, Math.ceil(Math.log2(Math.max(2, nodes.length)) + 1));
  const up: Array<Map<string, string | null>> = [];
  for (let i = 0; i <= LOG; i++) up.push(new Map());

  let timer = 0;
  const dfs = (u: string, p: string | null, d: number): void => {
    timer++;
    dfn.set(u, timer);
    depth.set(u, d);
    parent.set(u, p);
    up[0]!.set(u, p);
    hooks.onDfs?.(u, timer);
    for (const v of adj.get(u) ?? []) {
      if (v === p) continue;
      dfs(v, u, d + 1);
    }
  };
  if (nodes.includes(root)) dfs(root, null, 0);

  for (let k = 1; k <= LOG; k++) {
    for (const n of nodes) {
      const mid = up[k - 1]!.get(n) ?? null;
      up[k]!.set(n, mid === null ? null : (up[k - 1]!.get(mid) ?? null));
    }
  }

  /** x 是否为 y 的祖先。 */
  const _isAncestor = (x: string, y: string): boolean => {
    if ((depth.get(x) ?? 0) > (depth.get(y) ?? 0)) return false;
    let n = y;
    const diff = (depth.get(y) ?? 0) - (depth.get(x) ?? 0);
    for (let k = LOG; k >= 0; k--) {
      if (((diff >> k) & 1) === 1) n = up[k]!.get(n) ?? n;
    }
    return n === x;
  };

  const lca = (a: string, b: string): string => {
    let x = a;
    let y = b;
    if ((depth.get(x) ?? 0) < (depth.get(y) ?? 0)) [x, y] = [y, x];
    const diff = (depth.get(x) ?? 0) - (depth.get(y) ?? 0);
    for (let k = LOG; k >= 0; k--) {
      if (((diff >> k) & 1) === 1) x = up[k]!.get(x) ?? x;
    }
    if (x === y) {
      hooks.onLca?.(a, b, x);
      return x;
    }
    for (let k = LOG; k >= 0; k--) {
      const ux = up[k]!.get(x) ?? null;
      const uy = up[k]!.get(y) ?? null;
      if (ux !== uy) {
        x = ux ?? x;
        y = uy ?? y;
      }
    }
    const res = up[0]!.get(x) ?? x;
    hooks.onLca?.(a, b, res);
    return res;
  };

  // 关键点按 dfn 排序，加入相邻 LCA
  const keys = [...new Set(keyVertices)].filter((v) => dfn.has(v));
  keys.sort((a, b) => (dfn.get(a)! < dfn.get(b)! ? -1 : 1));

  const vertSet = new Set<string>(keys);
  for (let i = 0; i + 1 < keys.length; i++) {
    vertSet.add(lca(keys[i]!, keys[i + 1]!));
  }
  if (keys.length > 0) vertSet.add(root);

  const verts = [...vertSet].sort((a, b) => (dfn.get(a)! < dfn.get(b)! ? -1 : 1));
  verts.forEach((v) => hooks.onAddVertex?.(v));

  // 栈维护虚树最右链
  const vtEdges: Array<[string, string]> = [];
  const vtParent = new Map<string, string | null>();
  const stack: string[] = [];
  if (verts.length > 0) {
    stack.push(verts[0]!);
    vtParent.set(verts[0]!, null);
  }

  for (let i = 1; i < verts.length; i++) {
    const v = verts[i]!;
    // 计算 v 与栈顶的 LCA
    const l = lca(stack[stack.length - 1]!, v);
    // 弹出栈中深度 >= l 的节点，连接链
    while (stack.length > 1 && (depth.get(stack[stack.length - 2]!) ?? 0) >= (depth.get(l) ?? 0)) {
      const child = stack.pop()!;
      const par = stack[stack.length - 1]!;
      vtEdges.push([par, child]);
      vtParent.set(child, par);
      hooks.onTreeEdge?.(par, child);
    }
    if (stack[stack.length - 1] !== l) {
      // 连接 栈顶 → l
      const top = stack.pop()!;
      vtEdges.push([l, top]);
      vtParent.set(top, l);
      hooks.onTreeEdge?.(l, top);
      stack.push(l);
      vtParent.set(l, null);
    }
    stack.push(v);
  }
  // 收尾：把栈中剩余串起来
  while (stack.length > 1) {
    const child = stack.pop()!;
    const par = stack[stack.length - 1]!;
    vtEdges.push([par, child]);
    vtParent.set(child, par);
    hooks.onTreeEdge?.(par, child);
  }

  hooks.onDone?.(vtEdges.length);
  return { vertices: verts, edges: vtEdges, parent: vtParent };
}
