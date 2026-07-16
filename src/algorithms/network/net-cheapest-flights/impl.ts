export interface CfHooks {
  onRound?: (r: number) => void;
  onResult?: (cost: number) => void;
}
export function findCheapestPrice(
  n: number,
  flights: Array<[number, number, number]>,
  src: number,
  dst: number,
  k: number,
  hooks: CfHooks = {},
): number {
  let dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let r = 0; r <= k; r++) {
    hooks.onRound?.(r + 1);
    const next = [...dist];
    for (const [u, v, w] of flights)
      if (dist[u]! !== Infinity && dist[u]! + w < next[v]!) next[v] = dist[u]! + w;
    dist = next;
  }
  const cost = dist[dst] === Infinity ? -1 : dist[dst]!;
  hooks.onResult?.(cost);
  return cost;
}
