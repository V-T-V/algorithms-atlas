// =============================================================================
// 割点（Cut Vertex / Articulation Point）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 核心思想：无向图 DFS，维护 dfn 与 low。
//   - 非根节点 u 是割点：存在树子 v 使 low[v] >= dfn[u]
//   - 根节点 u 是割点：它在 DFS 树中至少有 2 个子树
// =============================================================================

/** 无向图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface CutVertexHooks {
  /** 首次访问节点 v，赋予 dfn=low。 */
  onDiscover?: (v: string, dfn: number) => void;
  /** 考察边 u->v。kind: 'tree' | 'back' | 'parent'。 */
  onExamine?: (u: string, v: string, kind: 'tree' | 'back' | 'parent') => void;
  /** 更新节点 u 的 low 值为 newLow。 */
  onUpdateLow?: (u: string, newLow: number) => void;
  /** 判定节点 u 为割点。 */
  onCutVertex?: (u: string, reason: 'root-multi-children' | 'low-v-geq-dfn') => void;
}

/** 结果：割点集合（按 id 排序）。 */
export interface CutVertexResult {
  cutVertices: string[];
}

/**
 * 无向图求割点（一次 DFS 森林）。
 *
 * @param input 无向图
 * @param hooks 可选事件钩子
 * @returns 割点集合
 */
export function cutVertex(input: GraphInput, hooks: CutVertexHooks = {}): CutVertexResult {
  const { nodes, edges } = input;

  // 无向邻接表（邻居按 id 升序，保证遍历顺序确定）
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to) && e.from !== e.to) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const isCut = new Set<string>();
  let timer = 0;

  const dfs = (u: string, par: string | null): void => {
    timer++;
    dfn.set(u, timer);
    low.set(u, timer);
    hooks.onDiscover?.(u, timer);

    let children = 0;
    const seenParent = new Map<string, number>();
    for (const v of adj.get(u) ?? []) {
      const seen = seenParent.get(v) ?? 0;
      if (!dfn.has(v)) {
        children++;
        seenParent.set(v, seen + 1);
        hooks.onExamine?.(u, v, 'tree');
        dfs(v, u);
        const newLow = Math.min(low.get(u) ?? Infinity, low.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
        // 非根割点：low[v] >= dfn[u]
        if (par !== null && (low.get(v) ?? Infinity) >= (dfn.get(u) ?? Infinity)) {
          if (!isCut.has(u)) {
            isCut.add(u);
            hooks.onCutVertex?.(u, 'low-v-geq-dfn');
          }
        }
      } else if (v === par && seen === 0) {
        seenParent.set(v, seen + 1);
        hooks.onExamine?.(u, v, 'parent');
      } else {
        seenParent.set(v, seen + 1);
        hooks.onExamine?.(u, v, 'back');
        const newLow = Math.min(low.get(u) ?? Infinity, dfn.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
      }
    }

    // 根节点割点：子树数 >= 2
    if (par === null && children >= 2) {
      if (!isCut.has(u)) {
        isCut.add(u);
        hooks.onCutVertex?.(u, 'root-multi-children');
      }
    }
  };

  for (const n of nodes) {
    if (!dfn.has(n)) dfs(n, null);
  }

  const cutVertices = [...isCut].sort();
  return { cutVertices };
}
