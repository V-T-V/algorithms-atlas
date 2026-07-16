// =============================================================================
// Floyd-Warshall
// =============================================================================

export interface FloydHooks {
  onInter?: (k: number, i: number, j: number, oldVal: number, newVal: number) => void;
  onDone?: (dist: number[][], hasNegCycle: boolean) => void;
}

export interface FloydResult {
  dist: number[][];
  hasNegativeCycle: boolean;
}

export function floyd(
  n: number,
  initial: (i: number, j: number) => number,
  hooks: FloydHooks = {},
): FloydResult {
  const INF = Number.POSITIVE_INFINITY;
  const dist: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : initial(i, j))),
  );
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const dk = dist[i]![k]!;
        const kd = dist[k]![j]!;
        if (Number.isFinite(dk) && Number.isFinite(kd)) {
          const cand = dk + kd;
          if (cand < dist[i]![j]!) {
            const old = dist[i]![j]!;
            dist[i]![j] = cand;
            hooks.onInter?.(k, i, j, old, cand);
          }
        }
      }
    }
  }
  let hasNeg = false;
  for (let i = 0; i < n; i++) if (dist[i]![i]! < 0) hasNeg = true;
  hooks.onDone?.(dist, hasNeg);
  return { dist, hasNegativeCycle: hasNeg };
}
