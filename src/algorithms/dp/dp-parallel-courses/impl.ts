// =============================================================================
// 并行课程 · 纯算法实现
// Kahn 拓扑分层 + dist[v] = max(dist[v], dist[u]+1)。
// =============================================================================

export interface ParallelCoursesHooks {
  onLayer?: (round: number, nodes: number[]) => void;
  onRelax?: (u: number, v: number, distV: number) => void;
  onResult?: (semesters: number) => void;
}

export function parallelCourses(
  n: number,
  relations: ReadonlyArray<[number, number]>,
  hooks: ParallelCoursesHooks = {},
): number {
  const adj = new Map<number, number[]>();
  const inDeg = new Map<number, number>();
  for (let i = 1; i <= n; i++) {
    adj.set(i, []);
    inDeg.set(i, 0);
  }
  for (const [u, v] of relations) {
    adj.get(u)!.push(v);
    inDeg.set(v, (inDeg.get(v) ?? 0) + 1);
  }
  const dist = new Map<number, number>();
  for (let i = 1; i <= n; i++) dist.set(i, 1);
  const queue: number[] = [];
  for (let i = 1; i <= n; i++) {
    if ((inDeg.get(i) ?? 0) === 0) queue.push(i);
  }
  let processed = 0;
  let round = 0;
  while (queue.length > 0) {
    round++;
    const layer: number[] = [];
    const size = queue.length;
    for (let s = 0; s < size; s++) {
      const u = queue.shift()!;
      layer.push(u);
      processed++;
      for (const v of adj.get(u) ?? []) {
        dist.set(v, Math.max(dist.get(v) ?? 1, (dist.get(u) ?? 0) + 1));
        hooks.onRelax?.(u, v, dist.get(v)!);
        const nd = (inDeg.get(v) ?? 0) - 1;
        inDeg.set(v, nd);
        if (nd === 0) queue.push(v);
      }
    }
    hooks.onLayer?.(round, layer);
  }
  if (processed < n) {
    hooks.onResult?.(-1);
    return -1;
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist.get(i) ?? 0);
  hooks.onResult?.(ans);
  return ans;
}
