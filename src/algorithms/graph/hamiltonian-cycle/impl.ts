// =============================================================================
// 哈密顿回路（Hamiltonian Cycle）· 纯算法实现
// 回溯法：固定起点 0，逐步扩展路径；当路径包含所有顶点且末顶点与起点相邻时形成回路。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  undirected?: boolean;
}

export interface HamiltonHooks {
  onExtend?: (path: string[]) => void;
  onBacktrack?: (path: string[]) => void;
  onResult?: (cycle: string[] | null) => void;
}

export interface HamiltonResult {
  cycle: string[] | null;
}

export function hamiltonianCycle(input: GraphInput, hooks: HamiltonHooks = {}): HamiltonResult {
  const undirected = input.undirected ?? true;
  const { nodes } = input;
  const n = nodes.length;
  if (n === 0) {
    hooks.onResult?.(null);
    return { cycle: null };
  }
  if (n === 1) {
    hooks.onResult?.([nodes[0]!]);
    return { cycle: [nodes[0]!] };
  }

  const adj = new Map<string, Set<string>>();
  for (const v of nodes) adj.set(v, new Set());
  for (const e of input.edges) {
    if (!adj.has(e.from) || !adj.has(e.to)) continue;
    adj.get(e.from)!.add(e.to);
    if (undirected) adj.get(e.to)!.add(e.from);
  }

  const start = nodes[0]!;
  const path: string[] = [start];
  const used = new Set<string>([start]);
  let found: string[] | null = null;

  const dfs = (): boolean => {
    if (path.length === n) {
      // 检查末顶点是否与起点相邻
      const last = path[path.length - 1]!;
      if (adj.get(last)?.has(start)) {
        found = [...path];
        hooks.onExtend?.(path);
        hooks.onResult?.([...path]);
        return true;
      }
      hooks.onExtend?.(path);
      return false;
    }
    hooks.onExtend?.(path);
    const last = path[path.length - 1]!;
    for (const v of nodes) {
      if (used.has(v)) continue;
      if (!adj.get(last)?.has(v)) continue;
      path.push(v);
      used.add(v);
      if (dfs()) return true;
      path.pop();
      used.delete(v);
      hooks.onBacktrack?.(path);
    }
    return false;
  };

  const ok = dfs();
  if (!ok) hooks.onResult?.(null);
  return { cycle: found };
}
