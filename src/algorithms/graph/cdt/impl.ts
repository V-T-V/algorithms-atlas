// =============================================================================
// 圆方树（Block-Cut Tree / Circle-Square Tree）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 原理：在无向图上求点双（VCC），对每个 VCC 建一个「方点」，把该 VCC 内所有
//       「圆点」（原图节点）连到方点，得到一棵树——圆方树。割点会连到多个方点。
// =============================================================================

/** 无向图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface CdtHooks {
  /** 首次访问节点 v，赋予 dfn=low。 */
  onDiscover?: (v: string, dfn: number) => void;
  /** 发现一个点双（环/块）：blocks 为该分量包含的全部原图节点。 */
  onComponent?: (blocks: string[]) => void;
  /** 新建一个方点 squareId，连接原图节点 vertices。 */
  onSquareNode?: (squareId: string, vertices: string[]) => void;
  /** 算法完成：圆方树边数。 */
  onDone?: (edgeCount: number) => void;
}

export interface CdtResult {
  /** 圆方树的所有节点（原图节点 + 方点 "S0","S1",...）。 */
  treeNodes: string[];
  /** 圆方树的边（圆-方连接），每条形如 [圆点, 方点]。 */
  treeEdges: Array<[string, string]>;
  /** 方点 → 其代表的点双节点集合。 */
  squareOf: Map<string, string[]>;
}

/**
 * 构建圆方树（块割树）。
 *
 * @param input 无向图
 * @param hooks 可选事件钩子
 * @returns 圆方树的节点、边、方点映射
 */
export function cdt(input: GraphInput, hooks: CdtHooks = {}): CdtResult {
  const { nodes, edges } = input;

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to) && e.from !== e.to) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const edgeStack: Array<[string, string]> = [];
  const treeEdges: Array<[string, string]> = [];
  const squareOf = new Map<string, string[]>();
  let timer = 0;
  let squareCount = 0;

  const makeSquare = (vertices: string[]): void => {
    const sid = `S${squareCount}`;
    squareCount++;
    squareOf.set(sid, vertices);
    for (const v of vertices) treeEdges.push([v, sid]);
    hooks.onSquareNode?.(sid, vertices);
  };

  // 弹边栈到 (u,v)，收集涉及的节点为一个点双
  const popUntil = (u: string, v: string): string[] => {
    const comp: string[] = [];
    const seen = new Set<string>();
    let top: [string, string] | undefined;
    do {
      top = edgeStack.pop();
      if (top) {
        for (const x of top) {
          if (!seen.has(x)) {
            seen.add(x);
            comp.push(x);
          }
        }
      }
    } while (top && !(top[0] === u && top[1] === v));
    return comp;
  };

  const dfs = (u: string, par: string | null): void => {
    timer++;
    dfn.set(u, timer);
    low.set(u, timer);
    hooks.onDiscover?.(u, timer);
    let _children = 0;
    const seenParent = new Map<string, number>();

    for (const v of adj.get(u) ?? []) {
      const seen = seenParent.get(v) ?? 0;
      if (!dfn.has(v)) {
        _children++;
        seenParent.set(v, seen + 1);
        edgeStack.push([u, v]);
        dfs(v, u);
        low.set(u, Math.min(low.get(u) ?? Infinity, low.get(v) ?? Infinity));
        const isCut = par !== null && (low.get(v) ?? Infinity) >= (dfn.get(u) ?? Infinity);
        // 割点：弹到 (u,v)；根节点：仅在最后一个子树回溯后弹（用 children 计数配合下面收尾）
        if (isCut) {
          const comp = popUntil(u, v);
          hooks.onComponent?.(comp);
          makeSquare(comp);
        }
      } else if (v === par && seen === 0) {
        seenParent.set(v, seen + 1);
      } else if ((dfn.get(v) ?? 0) < (dfn.get(u) ?? 0)) {
        seenParent.set(v, seen + 1);
        edgeStack.push([u, v]);
        low.set(u, Math.min(low.get(u) ?? Infinity, dfn.get(v) ?? Infinity));
      }
    }
  };

  for (const n of nodes) {
    if (!dfn.has(n)) {
      dfs(n, null);
      // 根连通块收尾：边栈残留构成最后一个点双
      if (edgeStack.length > 0) {
        const comp: string[] = [];
        const seen = new Set<string>();
        let top: [string, string] | undefined;
        while ((top = edgeStack.pop()) !== undefined) {
          for (const x of top) {
            if (!seen.has(x)) {
              seen.add(x);
              comp.push(x);
            }
          }
        }
        hooks.onComponent?.(comp);
        makeSquare(comp);
      } else if ((adj.get(n) ?? []).length === 0) {
        // 孤立点
        hooks.onComponent?.([n]);
        makeSquare([n]);
      }
    }
  }

  const treeNodes = [...nodes, ...[...squareOf.keys()]];
  hooks.onDone?.(treeEdges.length);
  return { treeNodes, treeEdges, squareOf };
}
