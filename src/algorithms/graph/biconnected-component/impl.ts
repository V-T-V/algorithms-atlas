// =============================================================================
// 点双连通分量（Biconnected Component / Block）· 纯算法实现
// 零 DOM 依赖，可独立单测。算法：DFS 维护 dfn/low，用边栈。
//   当 low[v] >= dfn[u]（v 是 u 的子节点）时，u 为割点；弹边栈到 (u,v) 得一个块。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface BccHooks {
  onDiscover?: (v: string, dfn: number) => void;
  onUpdateLow?: (v: string, newLow: number) => void;
  onCutVertex?: (v: string) => void;
  onComponent?: (component: string[], edges: Array<{ from: string; to: string }>) => void;
}

export interface BccResult {
  components: string[][];
  cutVertices: string[];
}

export function biconnectedComponent(input: GraphInput, hooks: BccHooks = {}): BccResult {
  const { nodes, edges } = input;
  // 无向图：双向邻接（保留原始边 id 以区分同一条无向边）
  type EdgeRef = { from: string; to: string; idx: number };
  const adj = new Map<string, EdgeRef[]>();
  for (const n of nodes) adj.set(n, []);
  edges.forEach((e, idx) => {
    if (!adj.has(e.from) || !adj.has(e.to)) return;
    adj.get(e.from)!.push({ from: e.from, to: e.to, idx });
    if (e.from !== e.to) adj.get(e.to)!.push({ from: e.to, to: e.from, idx });
  });

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const cut = new Set<string>();
  const components: string[][] = [];
  const usedEdge = new Set<number>();
  const edgeStack: EdgeRef[] = [];
  let timer = 0;

  for (const root of nodes) {
    if (dfn.has(root)) continue;
    // 迭代 DFS
    type Frame = { v: string; parent: number | null; ei: number; rootChild: number };
    const st: Frame[] = [{ v: root, parent: null, ei: 0, rootChild: 0 }];
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
        if (er.idx === f.parent) continue; // 跳过指向父亲的同一条无向边（首次出现）
        if (usedEdge.has(er.idx)) continue;
        usedEdge.add(er.idx);
        edgeStack.push(er);
        const w = er.to;
        if (!dfn.has(w)) {
          timer++;
          dfn.set(w, timer);
          low.set(w, timer);
          hooks.onDiscover?.(w, timer);
          st.push({ v: w, parent: er.idx, ei: 0, rootChild: 0 });
        } else {
          // 已访问：回边
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
          const pu = par.v;
          const lu = low.get(f.v) ?? Infinity;
          const dpu = dfn.get(pu) ?? Infinity;
          const newLow = Math.min(low.get(pu) ?? Infinity, lu);
          if (newLow !== (low.get(pu) ?? Infinity)) {
            low.set(pu, newLow);
            hooks.onUpdateLow?.(pu, newLow);
          }
          // 块判定：low[child] >= dfn[parent] => parent 为割点（非根）
          if (lu >= dpu) {
            const compEdges: EdgeRef[] = [];
            let top: EdgeRef;
            do {
              top = edgeStack.pop()!;
              compEdges.push(top);
            } while (top.from !== pu || top.to !== f.v);
            const compNodes = Array.from(new Set(compEdges.flatMap((e) => [e.from, e.to])));
            components.push(compNodes);
            hooks.onComponent?.(
              compNodes,
              compEdges.map((e) => ({ from: e.from, to: e.to })),
            );
            if (par.parent !== null || par.rootChild++ > 0) {
              // 非根必为割点；根有 >1 子树时为割点
              if (!cut.has(pu)) {
                cut.add(pu);
                hooks.onCutVertex?.(pu);
              }
            }
          }
        }
      }
    }
  }

  return { components, cutVertices: [...cut] };
}
