// =============================================================================
// 哈密顿回路（回溯）
// =============================================================================

export interface BipGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface HamiltonHooks {
  onExtend?: (path: string[]) => void;
  onBacktrack?: (path: string[]) => void;
  onDone?: (cycle: string[] | null) => void;
}

export function hamiltonCycle(input: BipGraphInput, hooks: HamiltonHooks = {}): string[] | null {
  const adj = new Map<string, Set<string>>();
  for (const n of input.nodes) adj.set(n, new Set());
  for (const e of input.edges) {
    adj.get(e.from)?.add(e.to);
    adj.get(e.to)?.add(e.from);
  }
  const n = input.nodes.length;
  const start = input.nodes[0]!;
  const visited = new Set<string>([start]);
  const path: string[] = [start];

  const dfs = (u: string): boolean => {
    if (path.length === n) {
      if (adj.get(u)?.has(start)) {
        hooks.onExtend?.([...path]);
        return true;
      }
      return false;
    }
    hooks.onExtend?.([...path]);
    for (const v of input.nodes) {
      if (!visited.has(v) && adj.get(u)?.has(v)) {
        visited.add(v);
        path.push(v);
        if (dfs(v)) return true;
        path.pop();
        visited.delete(v);
        hooks.onBacktrack?.([...path]);
      }
    }
    return false;
  };

  const found = dfs(start);
  const result = found ? [...path, start] : null;
  hooks.onDone?.(result);
  return result;
}
