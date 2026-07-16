// =============================================================================
// 网络延迟时间 · 纯算法实现（Dijkstra 线性扫描）
// =============================================================================

export interface NetworkDelayHooks {
  onSettle?: (node: number, dist: number) => void;
  onRelax?: (from: number, to: number, newDist: number, improved: boolean) => void;
  onResult?: (time: number) => void;
}

export function networkDelayTime(
  times: ReadonlyArray<[number, number, number]>,
  n: number,
  k: number,
  hooks: NetworkDelayHooks = {},
): number {
  const adj = new Map<number, Array<[number, number]>>();
  for (let i = 1; i <= n; i++) adj.set(i, []);
  for (const [u, v, w] of times) adj.get(u)!.push([v, w]);
  const dist = new Map<number, number>();
  for (let i = 1; i <= n; i++) dist.set(i, Infinity);
  dist.set(k, 0);
  const settled = new Set<number>();
  while (settled.size < n) {
    // 选未确定中 dist 最小者
    let u = -1;
    let bestD = Infinity;
    for (let i = 1; i <= n; i++) {
      if (!settled.has(i) && (dist.get(i) ?? Infinity) < bestD) {
        bestD = dist.get(i)!;
        u = i;
      }
    }
    if (u === -1) break; // 其余不可达
    settled.add(u);
    hooks.onSettle?.(u, bestD);
    for (const [v, w] of adj.get(u) ?? []) {
      if (settled.has(v)) continue;
      const nd = (dist.get(u) ?? Infinity) + w;
      const improved = nd < (dist.get(v) ?? Infinity);
      if (improved) dist.set(v, nd);
      hooks.onRelax?.(u, v, nd, improved);
    }
  }
  let maxD = 0;
  for (let i = 1; i <= n; i++) maxD = Math.max(maxD, dist.get(i) ?? Infinity);
  const result = maxD === Infinity ? -1 : maxD;
  hooks.onResult?.(result);
  return result;
}
