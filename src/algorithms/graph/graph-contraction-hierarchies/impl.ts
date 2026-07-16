// =============================================================================
// 层次收缩 (CH) · 纯算法实现（简化版）
// 节点按给定 order 收缩；收缩 u 时，对所有邻对 (v,w) 若存在更短 shortcut 则加入。
// 查询：双向 Dijkstra，只沿 order 增大方向松弛。
// =============================================================================

export interface CHGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  /** 节点重要性：越大越后收缩。 */
  order: ReadonlyArray<string>; // 从低到高（先收缩 order[0]）
}

export interface CHHooks {
  onContract?: (node: string, shortcutsAdded: number) => void;
  onSettle?: (side: 'fwd' | 'bwd', node: string, dist: number) => void;
  onDone?: (found: boolean, dist: number) => void;
}

export interface CHQueryResult {
  found: boolean;
  dist: number;
}

/** 比较两节点重要性：a 是否低于 b。 */
function lower(a: string, b: string, orderIndex: Map<string, number>): boolean {
  return (orderIndex.get(a) ?? -1) < (orderIndex.get(b) ?? -1);
}

export function contractionHierarchiesQuery(
  input: CHGraphInput,
  source: string,
  target: string,
  hooks: CHHooks = {},
): CHQueryResult {
  const orderIndex = new Map<string, number>();
  input.order.forEach((n, i) => orderIndex.set(n, i));
  // 邻接表（包含 shortcut），有向：fwd 与 bwd 分开
  const fwd = new Map<string, Array<{ to: string; w: number }>>();
  const bwd = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of input.nodes) {
    fwd.set(n, []);
    bwd.set(n, []);
  }
  const addEdge = (a: string, b: string, w: number): void => {
    fwd.get(a)!.push({ to: b, w });
    bwd.get(b)!.push({ to: a, w });
  };
  for (const e of input.edges) addEdge(e.from, e.to, e.weight);

  // 收缩过程：按 order 依次收缩，并加 shortcut
  const contracted = new Set<string>();
  for (const u of input.order) {
    // u 的未收缩邻居（双向）
    const inN = bwd
      .get(u)!
      .filter((e) => !contracted.has(e.to))
      .map((e) => e.to);
    const outN = fwd
      .get(u)!
      .filter((e) => !contracted.has(e.to))
      .map((e) => e.to);
    let added = 0;
    for (const v of inN) {
      for (const w of outN) {
        if (v === w) continue;
        // 估算：v->u->w 的路径长
        const vin = bwd.get(u)!.find((e) => e.to === v)!.w;
        const vout = fwd.get(u)!.find((e) => e.to === w)!.w;
        const shortcutW = vin + vout;
        addEdge(v, w, shortcutW);
        added++;
      }
    }
    contracted.add(u);
    hooks.onContract?.(u, added);
  }

  // 查询：双向 Dijkstra，前向只向 order 增大方向，反向只向 order 增大方向
  const distF = new Map<string, number>();
  const distB = new Map<string, number>();
  for (const n of input.nodes) {
    distF.set(n, Infinity);
    distB.set(n, Infinity);
  }
  if (!distF.has(source) || !distB.has(target)) {
    hooks.onDone?.(false, Infinity);
    return { found: false, dist: Infinity };
  }
  distF.set(source, 0);
  distB.set(target, 0);
  let best = Infinity;
  const settledF = new Set<string>();
  const settledB = new Set<string>();
  for (let iter = 0; iter < input.nodes.length * 2; iter++) {
    // 前向取未定居最小
    let uf: string | null = null;
    let bf = Infinity;
    for (const n of input.nodes) {
      if (!settledF.has(n) && (distF.get(n) ?? Infinity) < bf) {
        bf = distF.get(n)!;
        uf = n;
      }
    }
    if (uf !== null && bf < Infinity) {
      settledF.add(uf);
      hooks.onSettle?.('fwd', uf, bf);
      if (settledB.has(uf)) {
        const t = bf + (distB.get(uf) ?? Infinity);
        if (t < best) best = t;
      }
      // 前向仅松弛到 order 更大的邻居（向上）
      for (const { to, w } of fwd.get(uf) ?? []) {
        if (lower(uf, to, orderIndex)) {
          const nd = bf + w;
          if (nd < (distF.get(to) ?? Infinity)) distF.set(to, nd);
        }
      }
    }
    // 反向
    let ub: string | null = null;
    let bb = Infinity;
    for (const n of input.nodes) {
      if (!settledB.has(n) && (distB.get(n) ?? Infinity) < bb) {
        bb = distB.get(n)!;
        ub = n;
      }
    }
    if (ub !== null && bb < Infinity) {
      settledB.add(ub);
      hooks.onSettle?.('bwd', ub, bb);
      if (settledF.has(ub)) {
        const t = (distF.get(ub) ?? Infinity) + bb;
        if (t < best) best = t;
      }
      // 反向仅松弛到 order 更大的邻居（向上，因为反向图方向反转）
      for (const { to, w } of bwd.get(ub) ?? []) {
        if (lower(ub, to, orderIndex)) {
          const nd = bb + w;
          if (nd < (distB.get(to) ?? Infinity)) distB.set(to, nd);
        }
      }
    }
    // 终止条件：两侧各自的最小未定居距离之和已 ≥ best（且 best 已确定），可停止
    let minF = Infinity;
    let minB = Infinity;
    for (const n of input.nodes) {
      if (!settledF.has(n) && (distF.get(n) ?? Infinity) < minF) minF = distF.get(n)!;
      if (!settledB.has(n) && (distB.get(n) ?? Infinity) < minB) minB = distB.get(n)!;
    }
    if (uf === null && ub === null) break;
    if (best < Infinity && minF + minB >= best) break;
  }
  const found = best < Infinity;
  hooks.onDone?.(found, best);
  return { found, dist: best };
}
