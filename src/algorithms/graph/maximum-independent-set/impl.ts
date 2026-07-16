// =============================================================================
// 最大独立集（Maximum Independent Set）· 纯算法实现
// 分支定界（branch & bound）：选一个度数最大顶点 v，分「取 v」与「不取 v」两支；
//   上界 = 当前已选数 + 剩余顶点数，剪枝。等价于补图上的最大团，但实现为直接 MIS。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface MisHooks {
  onBranch?: (chosen: string[], remaining: string[], depth: number) => void;
  onUpdate?: (best: string[]) => void;
  onResult?: (mis: string[], size: number) => void;
}

export interface MisResult {
  set: string[];
  size: number;
}

export function maximumIndependentSet(input: GraphInput, hooks: MisHooks = {}): MisResult {
  const { nodes, edges } = input;
  const adj = new Map<string, Set<string>>();
  for (const v of nodes) adj.set(v, new Set());
  for (const e of edges) {
    if (!adj.has(e.from) || !adj.has(e.to)) continue;
    adj.get(e.from)!.add(e.to);
    adj.get(e.to)!.add(e.from);
  }

  let best: string[] = [];
  const allNodes = new Set<string>(nodes);

  // 在剩余顶点集 remain 上、已选 chosen 已确定的前提下求 MIS
  const solve = (chosen: string[], remain: Set<string>, depth: number): void => {
    // 上界剪枝
    if (chosen.length + remain.size <= best.length) return;
    if (remain.size === 0) {
      if (chosen.length > best.length) {
        best = [...chosen];
        hooks.onUpdate?.(best);
      }
      return;
    }
    hooks.onBranch?.(chosen, [...remain], depth);

    // 选一个分支点：取 remain 中度数（在 remain 内）最大的点，使两支差异大
    let v: string | null = null;
    let maxDeg = -1;
    for (const u of remain) {
      let d = 0;
      for (const nb of adj.get(u) ?? []) if (remain.has(nb)) d++;
      if (d > maxDeg) {
        maxDeg = d;
        v = u;
      }
    }
    if (v === null) return;

    // 分支 1：不取 v
    const remainNo = new Set(remain);
    remainNo.delete(v);
    solve(chosen, remainNo, depth + 1);

    // 分支 2：取 v（移除 v 及其邻居）
    const remainYes = new Set<string>();
    for (const u of remain) {
      if (u !== v && !adj.get(v)!.has(u)) remainYes.add(u);
    }
    solve([...chosen, v], remainYes, depth + 1);
  };

  solve([], allNodes, 0);

  best.sort();
  hooks.onResult?.(best, best.length);
  return { set: best, size: best.length };
}
