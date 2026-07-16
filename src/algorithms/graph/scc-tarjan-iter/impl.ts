// =============================================================================
// 强连通分量（SCC）迭代版 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 算法：Tarjan 的迭代（显式栈）实现，避免深度递归导致的栈溢出。
// 核心同递归版：维护 dfn、low 与一个节点栈；当 low[v]==dfn[v] 时弹栈得到一个 SCC。
// =============================================================================

/** 图输入（有向图）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface SccTarjanIterHooks {
  /** 首次访问节点 v（赋予 dfn/low，入栈）。 */
  onDiscover?: (v: string, dfn: number) => void;
  /** 考察边 u→v，kind 表示边的类型。 */
  onExamine?: (u: string, v: string, kind: 'tree' | 'back' | 'cross' | 'forward') => void;
  /** 更新节点 u 的 low 值为 newLow。 */
  onUpdateLow?: (u: string, newLow: number) => void;
  /** 发现一个 SCC：component 为该分量包含的全部节点。 */
  onComponent?: (component: string[]) => void;
}

export interface SccTarjanIterResult {
  components: string[][];
}

/** 一个节点的迭代帧状态。 */
interface FrameState {
  v: string;
  /** 下一条要考察的邻接边下标。 */
  ei: number;
  /** 是否为本次 DFS 的根（用于判断是否弹栈形成 SCC）。 */
}

/**
 * Tarjan SCC 的迭代实现（有向图）。
 *
 * @param input 图
 * @param hooks 可选事件钩子
 * @returns 所有 SCC 分量
 */
export function sccTarjanIter(
  input: GraphInput,
  hooks: SccTarjanIterHooks = {},
): SccTarjanIterResult {
  const { nodes, edges } = input;

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
  }
  for (const list of adj.values()) list.sort();

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const components: string[][] = [];
  let timer = 0;

  const kindOf = (u: string, v: string): 'tree' | 'back' | 'cross' | 'forward' => {
    if (!dfn.has(v)) return 'tree';
    if (onStack.has(v)) return 'back';
    return (dfn.get(v)! ?? 0) > (dfn.get(u)! ?? 0) ? 'forward' : 'cross';
  };

  for (const root of nodes) {
    if (dfn.has(root)) continue;
    // 显式栈
    const st: FrameState[] = [{ v: root, ei: 0 }];
    timer++;
    dfn.set(root, timer);
    low.set(root, timer);
    stack.push(root);
    onStack.add(root);
    hooks.onDiscover?.(root, timer);

    while (st.length > 0) {
      const f = st[st.length - 1]!;
      const u = f.v;
      const neighbors = adj.get(u) ?? [];
      if (f.ei < neighbors.length) {
        const v = neighbors[f.ei]!;
        f.ei++;
        const kind = kindOf(u, v);
        hooks.onExamine?.(u, v, kind);
        if (kind === 'tree') {
          timer++;
          dfn.set(v, timer);
          low.set(v, timer);
          stack.push(v);
          onStack.add(v);
          hooks.onDiscover?.(v, timer);
          st.push({ v, ei: 0 });
        } else if (kind === 'back') {
          const newLow = Math.min(low.get(u) ?? Infinity, dfn.get(v) ?? Infinity);
          if (newLow !== (low.get(u) ?? Infinity)) {
            low.set(u, newLow);
            hooks.onUpdateLow?.(u, newLow);
          }
        }
      } else {
        // u 的邻接处理完毕，回溯
        st.pop();
        const lu = low.get(u) ?? Infinity;
        const du = dfn.get(u) ?? Infinity;
        // 形成新 SCC
        if (lu === du) {
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
        // 用 low[u] 更新父节点 low
        if (st.length > 0) {
          const par = st[st.length - 1]!;
          const pu = par.v;
          const newLow = Math.min(low.get(pu) ?? Infinity, lu);
          if (newLow !== (low.get(pu) ?? Infinity)) {
            low.set(pu, newLow);
            hooks.onUpdateLow?.(pu, newLow);
          }
        }
      }
    }
  }

  return { components };
}
