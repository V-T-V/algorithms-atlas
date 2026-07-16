// =============================================================================
// 边双连通分量（Edge-Biconnected Component）· 纯算法实现
// 零 DOM 依赖。算法：DFS 求 dfn/low，桥边 (u,v) 满足 low[v] > dfn[u]；
//   删除所有桥后，每个连通块即为一个边双连通分量。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface EbcHooks {
  onDiscover?: (v: string, dfn: number) => void;
  onUpdateLow?: (v: string, newLow: number) => void;
  onBridge?: (from: string, to: string) => void;
  onComponent?: (component: string[]) => void;
}

export interface EbcResult {
  components: string[][];
  bridges: Array<{ from: string; to: string }>;
}

export function edgeBiconnectedComponent(input: GraphInput, hooks: EbcHooks = {}): EbcResult {
  const { nodes, edges } = input;
  type EdgeRef = { to: string; idx: number };
  const adj = new Map<string, EdgeRef[]>();
  for (const n of nodes) adj.set(n, []);
  edges.forEach((e, idx) => {
    if (!adj.has(e.from) || !adj.has(e.to)) return;
    adj.get(e.from)!.push({ to: e.to, idx });
    if (e.from !== e.to) adj.get(e.to)!.push({ to: e.from, idx });
  });

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const bridges: Array<{ from: string; to: string }> = [];
  const isBridge = new Set<number>();
  let timer = 0;

  for (const root of nodes) {
    if (dfn.has(root)) continue;
    type Frame = { v: string; parentEdge: number | null; ei: number };
    const st: Frame[] = [{ v: root, parentEdge: null, ei: 0 }];
    timer++;
    dfn.set(root, timer);
    low.set(root, timer);
    hooks.onDiscover?.(root, timer);

    while (st.length > 0) {
      const f = st[st.length - 1]!;
      const nbrs = adj.get(f.v) ?? [];
      if (f.ei < nbrs.length) {
        const er = nbrs[f.ei]!;
        f.ei++;
        if (er.idx === f.parentEdge) continue;
        const w = er.to;
        if (!dfn.has(w)) {
          timer++;
          dfn.set(w, timer);
          low.set(w, timer);
          hooks.onDiscover?.(w, timer);
          st.push({ v: w, parentEdge: er.idx, ei: 0 });
        } else {
          // 已访问：注意多次重边时每条都算；这里 er.idx 已知
          const newLow = Math.min(low.get(f.v) ?? Infinity, dfn.get(w) ?? Infinity);
          if (newLow !== (low.get(f.v) ?? Infinity)) {
            low.set(f.v, newLow);
            hooks.onUpdateLow?.(f.v, newLow);
          }
        }
      } else {
        st.pop();
        if (st.length > 0) {
          const par = st[st.length - 1]!;
          const lu = low.get(f.v) ?? Infinity;
          const newLow = Math.min(low.get(par.v) ?? Infinity, lu);
          if (newLow !== (low.get(par.v) ?? Infinity)) {
            low.set(par.v, newLow);
            hooks.onUpdateLow?.(par.v, newLow);
          }
          // 桥：low[child] > dfn[parent]
          if (lu > (dfn.get(par.v) ?? Infinity)) {
            const pe = par.parentEdge;
            if (pe !== null && !isBridge.has(pe)) {
              isBridge.add(pe);
              bridges.push({ from: par.v, to: f.v });
              hooks.onBridge?.(par.v, f.v);
            }
          }
        }
      }
    }
  }

  // 删桥后连通块
  const adj2 = new Map<string, string[]>();
  for (const n of nodes) adj2.set(n, []);
  edges.forEach((e, idx) => {
    if (isBridge.has(idx)) return;
    if (!adj2.has(e.from) || !adj2.has(e.to)) return;
    adj2.get(e.from)!.push(e.to);
    if (e.from !== e.to) adj2.get(e.to)!.push(e.from);
  });
  const visited = new Set<string>();
  const components: string[][] = [];
  for (const n of nodes) {
    if (visited.has(n)) continue;
    const comp: string[] = [];
    const st: string[] = [n];
    visited.add(n);
    while (st.length > 0) {
      const u = st.pop()!;
      comp.push(u);
      for (const w of adj2.get(u) ?? []) {
        if (!visited.has(w)) {
          visited.add(w);
          st.push(w);
        }
      }
    }
    components.push(comp);
    hooks.onComponent?.(comp);
  }

  return { components, bridges };
}
