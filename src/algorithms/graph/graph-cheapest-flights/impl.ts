// =============================================================================
// 便宜机票 · 纯算法实现（Bellman-Ford 限定 k+1 轮）
// =============================================================================

export interface CheapestFlightsHooks {
  onRound?: (round: number, dist: number[]) => void;
  onResult?: (price: number) => void;
}

export function findCheapestPrice(
  n: number,
  flights: ReadonlyArray<[number, number, number]>,
  src: number,
  dst: number,
  k: number,
  hooks: CheapestFlightsHooks = {},
): number {
  const dist: number[] = new Array<number>(n).fill(Infinity);
  dist[src] = 0;
  for (let round = 0; round <= k; round++) {
    const snapshot = [...dist];
    for (const [u, v, w] of flights) {
      if (snapshot[u]! === Infinity) continue;
      const cand = snapshot[u]! + w;
      if (cand < dist[v]!) dist[v] = cand;
    }
    hooks.onRound?.(round, [...dist]);
  }
  const result = dist[dst]! === Infinity ? -1 : dist[dst]!;
  hooks.onResult?.(result);
  return result;
}
