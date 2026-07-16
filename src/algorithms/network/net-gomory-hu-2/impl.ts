// Gusfield Gomory-Hu 树 · 实现
// 复用 gomory-hu-tree 的正确实现，提供 Gusfield 风格的树+查询接口。

import { gomoryHuTree, treeBottleneck } from '../gomory-hu-tree/impl.ts';

export interface Gh2Edge {
  from: number;
  to: number;
  cap: number;
}

export interface Gh2TreeEdge {
  from: number;
  to: number;
  weight: number;
}

export interface TreeAdjEntry {
  to: number;
  w: number;
}

export interface GusfieldResult {
  /** 邻接表形式的 Gomory-Hu 树。 */
  tree: Map<number, TreeAdjEntry[]>;
  /** 树边列表。 */
  edges: Gh2TreeEdge[];
}

/** 构造 Gomory-Hu 树（标准 Gusfield/并行收缩实现）。返回邻接表与树边。 */
export function gusfieldTree(n: number, edges: ReadonlyArray<Gh2Edge>): GusfieldResult {
  const inputEdges = edges.map((e) => ({ from: e.from, to: e.to, cap: e.cap }));
  const rawTree: number[][] = n <= 1 ? [] : gomoryHuTree(n, inputEdges);
  const tree = new Map<number, TreeAdjEntry[]>();
  for (let i = 0; i < n; i++) tree.set(i, []);
  const treeEdges: Gh2TreeEdge[] = [];
  for (const e of rawTree) {
    const [u, v, w] = e;
    const uu = u!;
    const vv = v!;
    const ww = w!;
    tree.get(uu)!.push({ to: vv, w: ww });
    tree.get(vv)!.push({ to: uu, w: ww });
    treeEdges.push({ from: uu, to: vv, weight: ww });
  }
  return { tree, edges: treeEdges };
}

/** 查询 s-t 最小割（树上路径最小边权）。 */
export function treeMinCut(tree: Map<number, TreeAdjEntry[]>, s: number, t: number): number {
  if (s === t) return Infinity;
  // 重建 number[][] 形式以复用 treeBottleneck
  const edges: number[][] = [];
  for (const [u, adj] of tree) {
    for (const e of adj) {
      if (u < e.to) edges.push([u, e.to, e.w]);
    }
  }
  return treeBottleneck(edges, s, t);
}
