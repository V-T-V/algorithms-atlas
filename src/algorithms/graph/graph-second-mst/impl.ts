// =============================================================================
// 次小生成树 · 纯算法实现
// 先 Kruskal 求 MST，再对每条非树边 (u,v,w)：在 T 上找 u-v 路径最大边 mx；
// 若 mx != w，候选 = MST + w - mx；严格次小取所有候选的最小者。
// =============================================================================

export interface WeightedGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

export interface SecondMstHooks {
  onMst?: (total: number) => void;
  onTryNonTree?: (
    from: string,
    to: string,
    weight: number,
    maxOnPath: number,
    candidate: number,
  ) => void;
  onDone?: (secondBest: number) => void;
}

export interface SecondMstResult {
  mstWeight: number;
  secondBest: number; // 严格次小，无则 Infinity
}

export function secondMst(input: WeightedGraphInput, hooks: SecondMstHooks = {}): SecondMstResult {
  const indexed = input.edges.map((e, i) => ({ ...e, i }));
  indexed.sort((a, b) => a.weight - b.weight);
  const parent = new Map<string, string>();
  for (const n of input.nodes) parent.set(n, n);
  const find = (x: string): string => {
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)!)!);
      x = parent.get(x)!;
    }
    return x;
  };
  const treeAdj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of input.nodes) treeAdj.set(n, []);
  const inTree = new Set<number>();
  let mstWeight = 0;
  for (const e of indexed) {
    const ra = find(e.from);
    const rb = find(e.to);
    if (ra !== rb) {
      parent.set(ra, rb);
      treeAdj.get(e.from)!.push({ to: e.to, w: e.weight });
      treeAdj.get(e.to)!.push({ to: e.from, w: e.weight });
      mstWeight += e.weight;
      inTree.add(e.i);
    }
  }
  hooks.onMst?.(mstWeight);

  // 在 T 上找 u-v 路径最大边
  const maxOnPath = (u: string, v: string): number => {
    // BFS 从 u，记录前驱与到前驱的边权
    const prev = new Map<string, { p: string; w: number } | null>([[u, null]]);
    const queue: string[] = [u];
    while (queue.length > 0) {
      const cur = queue.shift()!;
      if (cur === v) break;
      for (const { to, w } of treeAdj.get(cur) ?? []) {
        if (!prev.has(to)) {
          prev.set(to, { p: cur, w });
          queue.push(to);
        }
      }
    }
    let mx = -Infinity;
    let cur: string = v;
    while (prev.get(cur) !== null) {
      const step = prev.get(cur)!;
      if (step!.w > mx) mx = step!.w;
      cur = step!.p;
    }
    return mx;
  };

  let secondBest = Infinity;
  for (const e of indexed) {
    if (inTree.has(e.i)) continue;
    const mx = maxOnPath(e.from, e.to);
    if (mx !== e.weight) {
      const cand = mstWeight + e.weight - mx;
      hooks.onTryNonTree?.(e.from, e.to, e.weight, mx, cand);
      if (cand > mstWeight && cand < secondBest) secondBest = cand;
    }
  }
  hooks.onDone?.(secondBest);
  return { mstWeight, secondBest };
}
