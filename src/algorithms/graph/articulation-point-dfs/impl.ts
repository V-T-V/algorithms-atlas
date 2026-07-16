// =============================================================================
// 割点（Articulation Point）· 标准 DFS 模板（无向图）
// 根：DFS 子树数 >=2 即割点；非根 u：存在子 v 满足 low[v] >= dfn[u] 则 u 为割点。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface ArticulationHooks {
  onDiscover?: (v: string, parent: string | null, dfn: number) => void;
  onExamine?: (u: string, v: string, kind: 'tree' | 'back') => void;
  onUpdateLow?: (u: string, newLow: number) => void;
  onArticulation?: (v: string) => void;
}

export interface ArticulationResult {
  articulationPoints: string[];
}

export function articulationPointDfs(
  input: GraphInput,
  hooks: ArticulationHooks = {},
): ArticulationResult {
  const { nodes, edges } = input;

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to)) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const childCount = new Map<string, number>();
  const isArt = new Set<string>();
  let timer = 0;
  const result: string[] = [];

  const dfs = (u: string, parent: string | null): void => {
    timer++;
    dfn.set(u, timer);
    low.set(u, timer);
    childCount.set(u, 0);
    hooks.onDiscover?.(u, parent, timer);

    for (const v of adj.get(u) ?? []) {
      if (v === parent) continue;
      const kind: 'tree' | 'back' = dfn.has(v) ? 'back' : 'tree';
      hooks.onExamine?.(u, v, kind);
      if (kind === 'tree') {
        childCount.set(u, (childCount.get(u) ?? 0) + 1);
        dfs(v, u);
        const newLow = Math.min(low.get(u) ?? Infinity, low.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
        // 非根节点判定
        if (parent !== null && (low.get(v) ?? Infinity) >= (dfn.get(u) ?? Infinity)) {
          if (!isArt.has(u)) {
            isArt.add(u);
            result.push(u);
            hooks.onArticulation?.(u);
          }
        }
      } else {
        const newLow = Math.min(low.get(u) ?? Infinity, dfn.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
      }
    }
  };

  for (const root of nodes) {
    if (dfn.has(root)) continue;
    dfs(root, null);
    // 根节点判定：子树数 >= 2
    if ((childCount.get(root) ?? 0) >= 2) {
      if (!isArt.has(root)) {
        isArt.add(root);
        result.push(root);
        hooks.onArticulation?.(root);
      }
    }
  }

  return { articulationPoints: result };
}
