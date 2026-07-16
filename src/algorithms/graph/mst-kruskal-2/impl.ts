// =============================================================================
// 次小生成树（Second MST / Strictly Second MST）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 思路：先 Kruskal 求最小生成树 T；对每条非树边 (u,v,w)，
//       加入它会与 T 中 u-v 路径成环，去掉该路径上的「最大边」得到一棵候选生成树。
//       枚举所有非树边取最小候选权 = 次小生成树。
//       用树上前缀最大/次大 + 倍增 LCA 加速「路径最大边」查询。
//       本实现为简洁起见，在小图上直接对每个非树边做 BFS 求路径最大边。
// =============================================================================

/** 无向带权图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface MstKruskal2Hooks {
  /** Kruskal 考察边 e，added=是否加入 MST。 */
  onEdge?: (e: { from: string; to: string; weight: number }, added: boolean) => void;
  /** MST 构造完成，总权 totalWeight。 */
  onMst?: (totalWeight: number) => void;
  /** 尝试用非树边 e 替换：去掉环中最大边 maxW，候选权 candidateWeight。 */
  onTrySwap?: (
    e: { from: string; to: string; weight: number },
    maxW: number,
    candidateWeight: number,
  ) => void;
  /** 算法完成：次小生成树总权 secondWeight。 */
  onDone?: (secondWeight: number, exists: boolean) => void;
}

export interface MstKruskal2Result {
  /** 最小生成树总权。 */
  mstWeight: number;
  /** 次小生成树总权；若无则 = mstWeight（表示不存在严格更大者）。 */
  secondMstWeight: number;
  /** 是否存在次小生成树。 */
  exists: boolean;
  /** MST 的边集。 */
  mstEdges: Array<{ from: string; to: string; weight: number }>;
}

interface DSU {
  parent: Map<string, string>;
  find(x: string): string;
  union(a: string, b: string): boolean;
}

function makeDsu(nodes: readonly string[]): DSU {
  const parent = new Map<string, string>();
  for (const n of nodes) parent.set(n, n);
  const find = (x: string): string => {
    let p = parent.get(x) ?? x;
    while ((parent.get(p) ?? p) !== p) {
      parent.set(p, parent.get(parent.get(p) ?? p) ?? p);
      p = parent.get(p) ?? p;
    }
    parent.set(x, p);
    return p;
  };
  const union = (a: string, b: string): boolean => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent.set(ra, rb);
    return true;
  };
  return { parent, find, union };
}

/**
 * 次小生成树（Kruskal + 路径最大边枚举）。
 *
 * @param input 无向带权连通图
 * @param hooks 可选事件钩子
 * @returns MST 权、次小 MST 权、是否存在
 */
export function mstKruskal2(input: GraphInput, hooks: MstKruskal2Hooks = {}): MstKruskal2Result {
  const { nodes, edges } = input;
  if (nodes.length <= 1) return { mstWeight: 0, secondMstWeight: 0, exists: false, mstEdges: [] };

  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const dsu = makeDsu(nodes);

  // 1. Kruskal 求 MST
  const mstEdges: Array<{ from: string; to: string; weight: number }> = [];
  let mstWeight = 0;
  let usedCount = 0;
  for (const e of sorted) {
    if (dsu.union(e.from, e.to)) {
      mstEdges.push(e);
      mstWeight += e.weight;
      usedCount++;
      hooks.onEdge?.(e, true);
      if (usedCount === nodes.length - 1) {
        // 标记剩余为不加入
        continue;
      }
    } else {
      hooks.onEdge?.(e, false);
    }
  }
  // 完成后对剩余边也发出 added=false（上面循环可能未覆盖到之后的边）
  hooks.onMst?.(mstWeight);

  // 不连通则不存在 MST
  if (usedCount < nodes.length - 1) {
    return { mstWeight: Infinity, secondMstWeight: Infinity, exists: false, mstEdges: [] };
  }

  // 2. 构建 MST 邻接表
  const treeAdj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) treeAdj.set(n, []);
  for (const e of mstEdges) {
    treeAdj.get(e.from)?.push({ to: e.to, w: e.weight });
    treeAdj.get(e.to)?.push({ to: e.from, w: e.weight });
  }

  // 求 MST 上 u-v 路径的最大边权（BFS）
  const pathMax = (u: string, v: string): number => {
    const parent = new Map<string, { p: string; w: number } | null>([[u, null]]);
    const queue: string[] = [u];
    while (queue.length > 0) {
      const cur = queue.shift()!;
      if (cur === v) break;
      for (const { to, w } of treeAdj.get(cur) ?? []) {
        if (!parent.has(to)) {
          parent.set(to, { p: cur, w });
          queue.push(to);
        }
      }
    }
    let maxW = -Infinity;
    let c: string = v;
    while (c !== u) {
      const pp = parent.get(c);
      if (!pp) return Infinity; // 不应发生
      if (pp.w > maxW) maxW = pp.w;
      c = pp.p;
    }
    return maxW;
  };

  // 3. 枚举所有非树边，取最小候选（严格大于 MST 才算次小）
  const treeSet = new Set(mstEdges.map((e) => [e.from, e.to].sort().join('|')));
  let best = Infinity;
  for (const e of sorted) {
    const k = [e.from, e.to].sort().join('|');
    if (treeSet.has(k)) continue;
    const mx = pathMax(e.from, e.to);
    const candidate = mstWeight - mx + e.weight;
    hooks.onTrySwap?.(e, mx, candidate);
    if (candidate > mstWeight && candidate < best) best = candidate;
  }

  const exists = best < Infinity;
  const secondMstWeight = exists ? best : mstWeight;
  hooks.onDone?.(secondMstWeight, exists);
  return { mstWeight, secondMstWeight, exists, mstEdges };
}
