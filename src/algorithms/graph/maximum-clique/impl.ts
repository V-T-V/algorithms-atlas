// =============================================================================
// 最大团（Maximum Clique）· 纯算法实现
// Bron-Kerbosch 算法（带 pivot 与退化序剪枝）枚举极大团，记录最大者。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface CliqueHooks {
  onExpand?: (R: string[], P: string[], X: string[]) => void;
  onClique?: (clique: string[]) => void;
  onResult?: (maxClique: string[], size: number) => void;
}

export interface CliqueResult {
  clique: string[];
  size: number;
  maximalCount: number;
}

export function maximumClique(input: GraphInput, hooks: CliqueHooks = {}): CliqueResult {
  const { nodes, edges } = input;
  const adj = new Map<string, Set<string>>();
  for (const v of nodes) adj.set(v, new Set());
  for (const e of edges) {
    if (!adj.has(e.from) || !adj.has(e.to)) continue;
    adj.get(e.from)!.add(e.to);
    adj.get(e.to)!.add(e.from);
  }

  let best: string[] = [];
  let maximalCount = 0;

  const intersect = (a: Set<string>, b: Set<string>): Set<string> => {
    const r = new Set<string>();
    for (const x of a) if (b.has(x)) r.add(x);
    return r;
  };

  const choosePivot = (P: Set<string>, X: Set<string>): string | null => {
    // 选 P∪X 中使 |P ∩ N(u)| 最大的 u
    let bestU: string | null = null;
    let bestCnt = -1;
    const cand = new Set<string>([...P, ...X]);
    for (const u of cand) {
      const c = intersect(P, adj.get(u) ?? new Set()).size;
      if (c > bestCnt) {
        bestCnt = c;
        bestU = u;
      }
    }
    return bestU;
  };

  const bk = (RIn: string[], PIn: Set<string>, XIn: Set<string>): void => {
    hooks.onExpand?.(RIn, [...PIn], [...XIn]);
    if (PIn.size === 0 && XIn.size === 0) {
      maximalCount++;
      hooks.onClique?.(RIn);
      if (RIn.length > best.length) best = [...RIn];
      return;
    }
    const pivot = choosePivot(PIn, XIn);
    const puSet = pivot ? (adj.get(pivot) ?? new Set<string>()) : new Set<string>();
    // 遍历 P \ N(pivot)
    const candidates = [...PIn].filter((v) => !puSet.has(v));
    for (const v of candidates) {
      const nb = adj.get(v) ?? new Set<string>();
      const newP = intersect(PIn, nb);
      const newX = intersect(XIn, nb);
      bk([...RIn, v], newP, newX);
      PIn.delete(v);
      XIn.add(v);
    }
  };

  // 退化序（degeneracy ordering）作为外层顺序
  const deg = new Map<string, number>();
  for (const v of nodes) deg.set(v, adj.get(v)!.size);
  const order: string[] = [];
  const remaining = new Set(nodes);
  while (remaining.size > 0) {
    let minV: string | null = null;
    let minD = Infinity;
    for (const v of remaining) {
      const d = deg.get(v) ?? 0;
      if (d < minD) {
        minD = d;
        minV = v;
      }
    }
    if (minV === null) break;
    order.push(minV);
    remaining.delete(minV);
    for (const nb of adj.get(minV) ?? []) {
      if (remaining.has(nb)) deg.set(nb, (deg.get(nb) ?? 0) - 1);
    }
  }

  const pos = new Map<string, number>();
  order.forEach((v, i) => pos.set(v, i));
  const P0 = new Set<string>(nodes);
  for (const v of order) {
    P0.delete(v);
    const nb = adj.get(v) ?? new Set<string>();
    const after: Set<string> = new Set();
    for (const u of nb) if ((pos.get(u) ?? 0) > (pos.get(v) ?? 0)) after.add(u);
    const before: Set<string> = new Set();
    for (const u of nb) if ((pos.get(u) ?? 0) < (pos.get(v) ?? 0)) before.add(u);
    bk([v], after, before);
  }

  best.sort();
  hooks.onResult?.(best, best.length);
  return { clique: best, size: best.length, maximalCount };
}
