// =============================================================================
// 点双连通分量（Vertex Biconnected Component / Block）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 核心思想：无向图 DFS，维护 dfn/low 与一个边栈。
//   当 low[v] >= dfn[u]（u 是割点或根）时，弹边栈直至 (u,v) 得到一个点双（VCC）。
// =============================================================================

/** 无向图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface VccHooks {
  /** 首次访问节点 v，赋予 dfn=low。 */
  onDiscover?: (v: string, dfn: number) => void;
  /** 考察边 u->v。 */
  onExamine?: (u: string, v: string, kind: 'tree' | 'back' | 'parent') => void;
  /** 更新节点 u 的 low 值。 */
  onUpdateLow?: (u: string, newLow: number) => void;
  /** 发现一个点双连通分量：blocks 为该分量包含的全部节点。 */
  onComponent?: (blocks: string[]) => void;
}

export interface VccResult {
  /** 所有点双连通分量（每个为节点列表）。 */
  components: string[][];
  /** 割点集合（按 id 排序）。 */
  cutVertices: string[];
}

/**
 * 无向图求点双连通分量（一次 DFS 森林）。
 *
 * @param input 无向图
 * @param hooks 可选事件钩子
 * @returns 点双分量与割点
 */
export function vcc(input: GraphInput, hooks: VccHooks = {}): VccResult {
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
  const isCut = new Set<string>();
  const components: string[][] = [];
  // 边栈：每条以 "a>b" 记录（按访问方向）
  const edgeStack: Array<[string, string]> = [];
  let timer = 0;
  let rootChildren = 0;

  const dfs = (u: string, par: string | null, isRoot: boolean): void => {
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
        edgeStack.push([u, v]);
        hooks.onExamine?.(u, v, 'tree');
        dfs(v, u, false);
        const newLow = Math.min(low.get(u) ?? Infinity, low.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
        // 割点条件 / 形成点双
        if (isRoot ? children >= 2 : (low.get(v) ?? Infinity) >= (dfn.get(u) ?? Infinity)) {
          if (!isRoot) {
            if (!isCut.has(u)) isCut.add(u);
          } else if (children >= 2 && !isCut.has(u)) isCut.add(u);
          // 弹边栈到 (u,v)
          const comp: string[] = [];
          const seenNodes = new Set<string>();
          let top: [string, string] | undefined;
          do {
            top = edgeStack.pop();
            if (top) {
              if (!seenNodes.has(top[0])) {
                seenNodes.add(top[0]);
                comp.push(top[0]);
              }
              if (!seenNodes.has(top[1])) {
                seenNodes.add(top[1]);
                comp.push(top[1]);
              }
            }
          } while (top && !(top[0] === u && top[1] === v));
          components.push(comp);
          hooks.onComponent?.(comp);
        }
      } else if (v === par && seen === 0) {
        seenParent.set(v, seen + 1);
        hooks.onExamine?.(u, v, 'parent');
      } else if ((dfn.get(v) ?? 0) < (dfn.get(u) ?? 0)) {
        // 回边（指向已访问且 dfn 更小者）：入栈
        seenParent.set(v, seen + 1);
        hooks.onExamine?.(u, v, 'back');
        edgeStack.push([u, v]);
        const newLow = Math.min(low.get(u) ?? Infinity, dfn.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
      }
    }
  };

  for (const n of nodes) {
    if (!dfn.has(n)) {
      rootChildren = 0;
      dfs(n, null, true);
      // DFS 结束后边栈可能残留（单独一个连通块未触发割点）：作为最后一个分量
      if ((adj.get(n) ?? []).length === 0) {
        // 孤立点：自身构成一个点双
        components.push([n]);
        hooks.onComponent?.([n]);
      } else if (edgeStack.length > 0) {
        const comp: string[] = [];
        const seenNodes = new Set<string>();
        let top: [string, string] | undefined;
        while ((top = edgeStack.pop()) !== undefined) {
          if (!seenNodes.has(top[0])) {
            seenNodes.add(top[0]);
            comp.push(top[0]);
          }
          if (!seenNodes.has(top[1])) {
            seenNodes.add(top[1]);
            comp.push(top[1]);
          }
        }
        components.push(comp);
        hooks.onComponent?.(comp);
      }
    }
  }

  void rootChildren;
  const cutVertices = [...isCut].sort();
  return { components, cutVertices };
}
