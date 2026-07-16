export interface NdHooks {
  onRelax?: (v: number, d: number) => void;
  onResult?: (t: number) => void;
}
export function networkDelayTime(
  times: Array<[number, number, number]>,
  n: number,
  k: number,
  hooks: NdHooks = {},
): number {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u]!.push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const visited = new Array(n + 1).fill(false);
  for (let i = 0; i < n; i++) {
    let u = -1,
      best = Infinity;
    for (let j = 1; j <= n; j++)
      if (!visited[j] && dist[j]! < best) {
        best = dist[j]!;
        u = j;
      }
    if (u === -1) break;
    visited[u] = true;
    for (const [v, w] of adj[u]!)
      if (dist[u]! + w < dist[v]!) {
        dist[v] = dist[u]! + w;
        hooks.onRelax?.(v, dist[v]!);
      }
  }
  let max = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) {
      hooks.onResult?.(-1);
      return -1;
    }
    max = Math.max(max, dist[i]!);
  }
  hooks.onResult?.(max);
  return max;
}
