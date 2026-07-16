// =============================================================================
// 图同构判定（Graph Isomorphism）· 纯算法实现
// 简化 VF2 风格：先比较顶点数/边数/度序列，再用回溯建立双射映射，
//   逐步将 G1 的顶点映射到 G2，每步保证 (1) 目标未用；(2) 已映射邻居一致性。
// 通用图同构目前无已知多项式算法；本实现是实用的回溯搜索。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface IsoHooks {
  onMap?: (mapping: Record<string, string>) => void;
  onBacktrack?: (v1: string, v2: string) => void;
  onResult?: (iso: boolean, mapping: Record<string, string> | null) => void;
}

export interface IsoResult {
  isomorphic: boolean;
  mapping: Record<string, string> | null;
}

export function graphIsomorphism(g1: GraphInput, g2: GraphInput, hooks: IsoHooks = {}): IsoResult {
  if (g1.nodes.length !== g2.nodes.length) {
    hooks.onResult?.(false, null);
    return { isomorphic: false, mapping: null };
  }
  if (g1.edges.length !== g2.edges.length) {
    hooks.onResult?.(false, null);
    return { isomorphic: false, mapping: null };
  }

  const build = (g: GraphInput) => {
    const adj = new Map<string, Set<string>>();
    for (const v of g.nodes) adj.set(v, new Set());
    for (const e of g.edges) {
      if (!adj.has(e.from) || !adj.has(e.to)) continue;
      adj.get(e.from)!.add(e.to);
      adj.get(e.to)!.add(e.from);
    }
    return adj;
  };
  const adj1 = build(g1);
  const adj2 = build(g2);

  // 度序列校验
  const degSeq = (g: GraphInput, adj: Map<string, Set<string>>): number[] =>
    g.nodes.map((v) => adj.get(v)!.size).sort((a, b) => a - b);
  const ds1 = degSeq(g1, adj1);
  const ds2 = degSeq(g2, adj2);
  if (!ds1.every((d, i) => d === ds2[i])) {
    hooks.onResult?.(false, null);
    return { isomorphic: false, mapping: null };
  }

  const n = g1.nodes.length;
  const order1 = [...g1.nodes]; // G1 固定顺序
  const map: Record<string, string> = {}; // g1.v -> g2.v
  const used2 = new Set<string>();

  // 候选：按 G2 度数分组
  const byDeg = new Map<number, string[]>();
  for (const v of g2.nodes) {
    const d = adj2.get(v)!.size;
    if (!byDeg.has(d)) byDeg.set(d, []);
    byDeg.get(d)!.push(v);
  }

  let solution: Record<string, string> | null = null;

  const consistent = (u: string, target: string): boolean => {
    // 检查 u 在 G1 中已映射的邻居，是否对应 target 的邻居
    let mappedNbrCount = 0;
    for (const nb of adj1.get(u) ?? []) {
      const m = map[nb];
      if (m !== undefined) {
        mappedNbrCount++;
        if (!adj2.get(target)!.has(m)) return false;
      }
    }
    // 反向：target 已映射的邻居应与 u 的已映射邻居一一对应（数量相等保证）
    // （数量校验已被对称性覆盖，这里加显式检查更稳）
    let mappedNbrCount2 = 0;
    for (const nb of adj2.get(target) ?? []) {
      // nb 是否为某个 G1 顶点的像？
      for (const k of Object.keys(map)) {
        if (map[k] === nb) {
          mappedNbrCount2++;
          if (!adj1.get(u)!.has(k)) return false;
          break;
        }
      }
    }
    if (mappedNbrCount !== mappedNbrCount2) return false;
    return true;
  };

  const dfs = (i: number): boolean => {
    if (i === n) {
      solution = { ...map };
      hooks.onMap?.({ ...map });
      return true;
    }
    const u = order1[i]!;
    const d = adj1.get(u)!.size;
    for (const cand of byDeg.get(d) ?? []) {
      if (used2.has(cand)) continue;
      if (!consistent(u, cand)) continue;
      map[u] = cand;
      used2.add(cand);
      hooks.onMap?.({ ...map });
      if (dfs(i + 1)) return true;
      delete map[u];
      used2.delete(cand);
      hooks.onBacktrack?.(u, cand);
    }
    return false;
  };

  const ok = dfs(0);
  hooks.onResult?.(ok, solution);
  return { isomorphic: ok, mapping: solution };
}
