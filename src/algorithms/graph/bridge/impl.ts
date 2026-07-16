// =============================================================================
// 桥（Bridge）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 核心思想：无向图 DFS，维护 dfn（发现序）与 low（经至多一条回边可达的最小 dfn）。
//   桥 (u,v)：树边且 low[v] > dfn[u]，删去它会使图不连通。
// =============================================================================

/** 无向图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 边的标准化字符串（小->大），便于去重/集合。 */
export function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface BridgeHooks {
  /** 首次访问节点 v，赋予 dfn=low。 */
  onDiscover?: (v: string, dfn: number) => void;
  /** 考察边 u->v。kind: 'tree'(树边) | 'back'(回边) | 'parent'(指向直接父节点，跳过)。 */
  onExamine?: (u: string, v: string, kind: 'tree' | 'back' | 'parent') => void;
  /** 更新节点 u 的 low 值为 newLow（由子节点回溯或回边传播）。 */
  onUpdateLow?: (u: string, newLow: number) => void;
  /** 判定边 (u,v) 为桥。 */
  onBridge?: (u: string, v: string) => void;
}

/** 结果：桥集合（按 edgeKey 排序）。 */
export interface BridgeResult {
  bridges: string[]; // 形如 "u|v"
}

/**
 * 无向图求桥（一次 DFS 森林，Tarjan 思想）。
 *
 * @param input 无向图
 * @param hooks 可选事件钩子
 * @returns 桥集合
 */
export function bridge(input: GraphInput, hooks: BridgeHooks = {}): BridgeResult {
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
  const bridgeSet = new Set<string>();
  let timer = 0;

  const dfs = (u: string, par: string | null): void => {
    timer++;
    dfn.set(u, timer);
    low.set(u, timer);
    hooks.onDiscover?.(u, timer);

    // 处理多重边：仅把「直接父边」跳过一次
    const seenParent = new Map<string, number>();
    for (const v of adj.get(u) ?? []) {
      const seen = seenParent.get(v) ?? 0;
      if (!dfn.has(v)) {
        seenParent.set(v, seen + 1);
        hooks.onExamine?.(u, v, 'tree');
        dfs(v, u);
        const newLow = Math.min(low.get(u) ?? Infinity, low.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
        // 桥：树边且 low[v] > dfn[u]
        if ((low.get(v) ?? Infinity) > (dfn.get(u) ?? Infinity)) {
          const key = edgeKey(u, v);
          bridgeSet.add(key);
          hooks.onBridge?.(u, v);
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
  };

  for (const n of nodes) {
    if (!dfn.has(n)) dfs(n, null);
  }

  const bridges = [...bridgeSet].sort();
  return { bridges };
}
