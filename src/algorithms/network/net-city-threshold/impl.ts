export interface CtHooks {
  onCount?: (city: number, cnt: number) => void;
  onResult?: (city: number) => void;
}
export function findTheCity(
  n: number,
  edges: Array<[number, number, number]>,
  threshold: number,
  hooks: CtHooks = {},
): number {
  const INF = 1 << 29;
  const dist: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : INF)),
  );
  for (const [u, v, w] of edges) {
    dist[u]![v] = w;
    dist[v]![u] = w;
  }
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i]![k]! + dist[k]![j]! < dist[i]![j]!) dist[i]![j] = dist[i]![k]! + dist[k]![j]!;
  let best = -1,
    minCnt = Infinity;
  for (let i = 0; i < n; i++) {
    let cnt = 0;
    for (let j = 0; j < n; j++) if (i !== j && dist[i]![j]! <= threshold) cnt++;
    hooks.onCount?.(i, cnt);
    if (cnt <= minCnt) {
      minCnt = cnt;
      best = i;
    }
  }
  hooks.onResult?.(best);
  return best;
}
