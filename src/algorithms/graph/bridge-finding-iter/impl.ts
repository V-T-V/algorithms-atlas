// =============================================================================
// 找桥（Bridge）· 迭代 DFS（无向图）
// 树边 u—v 若 low[v] > dfn[u] 则为桥。用半边 id 配对以正确处理重边。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface BridgeHooks {
  onDiscover?: (v: string, parentEdge: number | null, dfn: number) => void;
  onExamine?: (u: string, v: string, kind: 'tree' | 'back') => void;
  onUpdateLow?: (u: string, newLow: number) => void;
  onBridge?: (from: string, to: string) => void;
}

export interface BridgeResult {
  bridges: Array<{ from: string; to: string }>;
}

interface HalfEdge {
  to: string;
  /** 本半边自身 id。 */
  id: number;
  /** 配对的反向半边 id（用于跳过父边，正确处理重边）。 */
  pair: number;
}

export function bridgeFindingIter(input: GraphInput, hooks: BridgeHooks = {}): BridgeResult {
  const { nodes, edges } = input;

  // 每条无向边拆成两条有向半边，按输入顺序配对：id 0↔1, 2↔3, ...
  const adj = new Map<string, HalfEdge[]>();
  for (const n of nodes) adj.set(n, []);
  edges.forEach((e, i) => {
    const id = i * 2;
    if (adj.has(e.from)) adj.get(e.from)!.push({ to: e.to, id, pair: id + 1 });
    if (adj.has(e.to)) adj.get(e.to)!.push({ to: e.from, id: id + 1, pair: id });
  });
  for (const list of adj.values()) {
    list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : a.id - b.id));
  }

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  let timer = 0;
  const bridges: Array<{ from: string; to: string }> = [];

  interface FrameState {
    v: string;
    parentEdge: number | null;
    /** 下一要考察的邻接下标。 */
    ei: number;
  }

  for (const root of nodes) {
    if (dfn.has(root)) continue;
    const st: FrameState[] = [{ v: root, parentEdge: null, ei: 0 }];
    timer++;
    dfn.set(root, timer);
    low.set(root, timer);
    hooks.onDiscover?.(root, null, timer);

    while (st.length > 0) {
      const f = st[st.length - 1]!;
      const u = f.v;
      const neighbors = adj.get(u) ?? [];
      if (f.ei < neighbors.length) {
        const he = neighbors[f.ei]!;
        f.ei++;
        // 跳过父边：当前半边的反向 pair 即父边 id
        if (f.parentEdge !== null && he.pair === f.parentEdge) {
          // 不发事件，静默跳过
          continue;
        }
        const v = he.to;
        const kind: 'tree' | 'back' = dfn.has(v) ? 'back' : 'tree';
        hooks.onExamine?.(u, v, kind);
        if (kind === 'tree') {
          timer++;
          dfn.set(v, timer);
          low.set(v, timer);
          // 记录本半边 id 作为子节点的父边标识
          hooks.onDiscover?.(v, he.id, timer);
          st.push({ v, parentEdge: he.id, ei: 0 });
        } else {
          const newLow = Math.min(low.get(u) ?? Infinity, dfn.get(v) ?? Infinity);
          if (newLow !== (low.get(u) ?? Infinity)) {
            low.set(u, newLow);
            hooks.onUpdateLow?.(u, newLow);
          }
        }
      } else {
        st.pop();
        if (st.length > 0) {
          const par = st[st.length - 1]!;
          const pu = par.v;
          const lv = low.get(u) ?? Infinity;
          const dv = dfn.get(u) ?? Infinity;
          const newLow = Math.min(low.get(pu) ?? Infinity, lv);
          if (newLow !== (low.get(pu) ?? Infinity)) {
            low.set(pu, newLow);
            hooks.onUpdateLow?.(pu, newLow);
          }
          // 桥判定：low[v] > dfn[父]
          if (lv > (dfn.get(pu) ?? Infinity)) {
            // 注意 dv 是 v 自己的 dfn，比较要用 low[v] vs dfn[parent]
            void dv;
            bridges.push({ from: pu, to: u });
            hooks.onBridge?.(pu, u);
          }
        }
      }
    }
  }

  return { bridges };
}
