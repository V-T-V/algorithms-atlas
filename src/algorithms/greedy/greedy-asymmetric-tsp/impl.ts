// 最近邻 TSP · 实现
export interface NnHooks {
  onVisit?: (from: number, to: number, dist: number) => void;
  onConclude?: (tour: number[], totalDist: number) => void;
}
export function nearestNeighborTsp(
  dist: ReadonlyArray<readonly number[]>,
  start = 0,
  hooks: NnHooks = {},
): { tour: number[]; total: number } {
  const n = dist.length;
  const visited = new Array<boolean>(n).fill(false);
  const tour: number[] = [start];
  visited[start] = true;
  let cur = start,
    total = 0;
  for (let k = 1; k < n; k++) {
    let best = -1,
      bestD = Infinity;
    for (let j = 0; j < n; j++)
      if (!visited[j] && dist[cur]![j]! < bestD) {
        bestD = dist[cur]![j]!;
        best = j;
      }
    tour.push(best!);
    visited[best!] = true;
    total += bestD;
    hooks.onVisit?.(cur, best!, bestD);
    cur = best!;
  }
  total += dist[cur]![start]!;
  tour.push(start);
  hooks.onConclude?.(tour, total);
  return { tour, total };
}
