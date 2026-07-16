// =============================================================================
// 可达节点 · 纯算法实现（Dijkstra + 边剩余预算）
// =============================================================================

export interface ReachableNodesHooks {
  onSettle?: (node: number, dist: number) => void;
  onResult?: (count: number) => void;
}

export function reachableNodes(
  edges: ReadonlyArray<[number, number, number]>,
  maxMoves: number,
  n: number,
  hooks: ReachableNodesHooks = {},
): number {
  // 邻接表（记录 contract 子节点数）
  const adj = new Map<number, Array<[number, number]>>();
  for (let i = 0; i < n; i++) adj.set(i, []);
  for (const [u, v, cnt] of edges) {
    adj.get(u)!.push([v, cnt + 1]); // 边的段数 = 子节点数 + 1
    adj.get(v)!.push([u, cnt + 1]);
  }
  const dist = new Map<number, number>();
  for (let i = 0; i < n; i++) dist.set(i, Infinity);
  dist.set(0, 0);
  const settled = new Set<number>();
  while (settled.size < n) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!settled.has(i) && (dist.get(i) ?? Infinity) < best) {
        best = dist.get(i)!;
        u = i;
      }
    }
    if (u === -1 || best > maxMoves) break;
    settled.add(u);
    hooks.onSettle?.(u, best);
    for (const [v, seg] of adj.get(u) ?? []) {
      if (settled.has(v)) continue;
      const nd = best + seg;
      if (nd < (dist.get(v) ?? Infinity)) dist.set(v, nd);
    }
  }
  // 可达原图节点
  let ans = 0;
  for (let i = 0; i < n; i++) {
    if ((dist.get(i) ?? Infinity) <= maxMoves) ans++;
  }
  // 每条边的中间节点
  for (const [u, v, cnt] of edges) {
    const du = dist.get(u) ?? Infinity;
    const dv = dist.get(v) ?? Infinity;
    const leftU = du <= maxMoves ? maxMoves - du : 0;
    const leftV = dv <= maxMoves ? maxMoves - dv : 0;
    ans += Math.min(cnt, leftU + leftV);
  }
  hooks.onResult?.(ans);
  return ans;
}
