// =============================================================================
// Bellman-Ford
// =============================================================================

import type { WeightedGraphInput } from '../graph-dijkstra-3/impl.ts';
export type { WeightedGraphInput };

export interface BellmanHooks {
  onRound?: (round: number, updated: boolean) => void;
  onRelax?: (from: string, to: string, w: number, oldDist: number, newDist: number) => void;
  onDone?: (
    dist: Map<string, number>,
    prev: Map<string, string | null>,
    hasNegCycle: boolean,
  ) => void;
}

export interface BellmanResult {
  dist: Map<string, number>;
  prev: Map<string, string | null>;
  hasNegativeCycle: boolean;
}

export function bellmanFord(
  input: WeightedGraphInput,
  start: string,
  hooks: BellmanHooks = {},
): BellmanResult {
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  for (const n of input.nodes) {
    dist.set(n, Number.POSITIVE_INFINITY);
    prev.set(n, null);
  }
  dist.set(start, 0);
  const n = input.nodes.length;
  const edges = input.edges;
  for (let round = 1; round <= n - 1; round++) {
    let updated = false;
    for (const e of edges) {
      const du = dist.get(e.from) ?? Infinity;
      if (!Number.isFinite(du)) continue;
      const nd = du + e.weight;
      const old = dist.get(e.to) ?? Infinity;
      if (nd < old) {
        dist.set(e.to, nd);
        prev.set(e.to, e.from);
        updated = true;
        hooks.onRelax?.(e.from, e.to, e.weight, old, nd);
      }
    }
    hooks.onRound?.(round, updated);
    if (!updated) break;
  }
  // 第 n 轮检测负环
  let hasNeg = false;
  for (const e of edges) {
    const du = dist.get(e.from) ?? Infinity;
    if (Number.isFinite(du) && du + e.weight < (dist.get(e.to) ?? Infinity)) {
      hasNeg = true;
      break;
    }
  }
  hooks.onDone?.(dist, prev, hasNeg);
  return { dist, prev, hasNegativeCycle: hasNeg };
}
