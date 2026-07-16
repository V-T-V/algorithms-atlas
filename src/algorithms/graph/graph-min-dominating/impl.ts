// =============================================================================
// 最小支配集（贪心近似）· 纯算法实现
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface DominatingHooks {
  onPick?: (node: string, newlyCovered: number) => void;
  onDone?: (set: string[], size: number) => void;
}

export function minDominatingSetGreedy(input: GraphInput, hooks: DominatingHooks = {}): string[] {
  const adj = new Map<string, Set<string>>();
  for (const n of input.nodes) adj.set(n, new Set([n])); // 含自身
  for (const e of input.edges) {
    adj.get(e.from)?.add(e.to);
    adj.get(e.to)?.add(e.from);
  }
  const dominated = new Set<string>();
  const result: string[] = [];
  while (dominated.size < input.nodes.length) {
    let best: string | null = null;
    let bestGain = -1;
    for (const v of input.nodes) {
      let gain = 0;
      for (const nb of adj.get(v) ?? []) if (!dominated.has(nb)) gain++;
      if (gain > bestGain || (gain === bestGain && best !== null && v < best)) {
        bestGain = gain;
        best = v;
      }
    }
    if (best === null || bestGain === 0) {
      // 兜底：随便挑一个未支配的
      for (const v of input.nodes) {
        if (!dominated.has(v)) {
          best = v;
          bestGain = 1;
          break;
        }
      }
    }
    if (best === null) break;
    result.push(best);
    hooks.onPick?.(best, bestGain);
    for (const nb of adj.get(best) ?? []) dominated.add(nb);
  }
  hooks.onDone?.(result, result.length);
  return result;
}
