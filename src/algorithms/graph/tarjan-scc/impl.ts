// =============================================================================
// Tarjan 强连通分量（SCC）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 算法核心：DFS 过程中维护 dfn（发现序）与 low（可达的最小 dfn），
// 配合一个栈，当 low[v] == dfn[v] 时弹栈得到一个 SCC。
// =============================================================================

/** 图输入（有向图）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** Tarjan 执行过程中的事件钩子。任一可选。 */
export interface TarjanHooks {
  /** 首次访问节点 v（赋予 dfn/low）。 */
  onDiscover?: (v: string, dfn: number) => void;
  /** 考察边 u→v（无论 v 是否已访问）。kind 表示边的类型。 */
  onExamine?: (u: string, v: string, kind: 'tree' | 'back' | 'cross' | 'forward') => void;
  /** 更新节点 u 的 low 值为 newLow（由子节点回溯传播）。 */
  onUpdateLow?: (u: string, newLow: number) => void;
  /** 发现一个 SCC：components 为该分量包含的全部节点。 */
  onComponent?: (component: string[]) => void;
}

export interface TarjanResult {
  /** 所有 SCC 分量；每个分量是该组节点 id 列表（按发现顺序）。 */
  components: string[][];
}

/**
 * Tarjan 强连通分量算法（有向图，一次 DFS）。
 *
 * @param input 图
 * @param hooks 可选事件钩子
 * @returns 所有 SCC 分量
 */
export function tarjanScc(input: GraphInput, hooks: TarjanHooks = {}): TarjanResult {
  const { nodes, edges } = input;

  // 邻接表（邻居按 id 升序，保证遍历顺序确定）
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
  }
  for (const list of adj.values()) list.sort();

  const dfn = new Map<string, number>(); // 发现时间戳
  const low = new Map<string, number>(); // low 值
  const onStack = new Set<string>(); // 是否在栈中
  const stack: string[] = [];
  const components: string[][] = [];
  let timer = 0;

  const kindOf = (u: string, v: string): 'tree' | 'back' | 'cross' | 'forward' => {
    if (!dfn.has(v)) return 'tree';
    // v 已访问
    if (onStack.has(v)) return 'back'; // v 在栈中：可形成环（回溯边）
    // v 已不在栈中（已归入某 SCC）
    return (dfn.get(v)! ?? 0) > (dfn.get(u)! ?? 0) ? 'forward' : 'cross';
  };

  const strongConnect = (u: string): void => {
    timer++;
    dfn.set(u, timer);
    low.set(u, timer);
    stack.push(u);
    onStack.add(u);
    hooks.onDiscover?.(u, timer);

    for (const v of adj.get(u) ?? []) {
      const kind = kindOf(u, v);
      hooks.onExamine?.(u, v, kind);
      if (kind === 'tree') {
        strongConnect(v);
        const newLow = Math.min(low.get(u) ?? Infinity, low.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
      } else if (kind === 'back') {
        // 回溯边：用 v 的 dfn 更新 low[u]
        const newLow = Math.min(low.get(u) ?? Infinity, dfn.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
      }
      // cross/forward：不更新
    }

    // 若 u 是 SCC 的根：弹栈到 u
    if (low.get(u) === dfn.get(u)) {
      const comp: string[] = [];
      let w: string;
      do {
        w = stack.pop()!;
        onStack.delete(w);
        comp.push(w);
      } while (w !== u);
      components.push(comp);
      hooks.onComponent?.(comp);
    }
  };

  for (const n of nodes) {
    if (!dfn.has(n)) strongConnect(n);
  }

  return { components };
}
