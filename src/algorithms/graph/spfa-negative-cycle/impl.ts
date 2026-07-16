// =============================================================================
// SPFA 负环检测（有向图）
// 超级源点连向所有节点；某点入队次数 >= V+1 即存在负环。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

export interface SpfaHooks {
  onRelax?: (u: string, v: string, newDist: number) => void;
  onEnqueue?: (v: string, count: number) => void;
  onDequeue?: (v: string) => void;
  onResult?: (hasNegativeCycle: boolean, dist: Map<string, number>) => void;
}

export interface SpfaResult {
  hasNegativeCycle: boolean;
  dist: Map<string, number>;
}

export function spfaNegativeCycle(input: GraphInput, hooks: SpfaHooks = {}): SpfaResult {
  const { nodes, edges } = input;
  const n = nodes.length;

  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const node of nodes) adj.set(node, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push({ to: e.to, w: e.weight });
  }

  const INF = Infinity;
  const dist = new Map<string, number>();
  const cnt = new Map<string, number>(); // 入队次数
  const inQueue = new Set<string>();
  for (const node of nodes) {
    dist.set(node, INF);
    cnt.set(node, 0);
  }

  // 超级源点：所有节点初始 dist=0 并入队，等价于超级源点连向所有节点
  const queue: string[] = [];
  for (const node of nodes) {
    dist.set(node, 0);
    queue.push(node);
    inQueue.add(node);
    cnt.set(node, 1);
    hooks.onEnqueue?.(node, 1);
  }

  let hasNeg = false;

  while (queue.length > 0) {
    const u = queue.shift()!;
    inQueue.delete(u);
    hooks.onDequeue?.(u);
    const du = dist.get(u) ?? INF;
    if (du === INF) continue;
    for (const { to: v, w } of adj.get(u) ?? []) {
      const nd = du + w;
      if (nd < (dist.get(v) ?? INF)) {
        dist.set(v, nd);
        hooks.onRelax?.(u, v, nd);
        if (!inQueue.has(v)) {
          const c = (cnt.get(v) ?? 0) + 1;
          cnt.set(v, c);
          hooks.onEnqueue?.(v, c);
          // 入队次数 > n 即存在负环（超级源点使阈值等价于 n+1，这里用 >= n+1）
          if (c >= n + 1) {
            hasNeg = true;
            queue.length = 0;
            break;
          }
          queue.push(v);
          inQueue.add(v);
        }
      }
    }
    if (hasNeg) break;
  }

  hooks.onResult?.(hasNeg, dist);
  return { hasNegativeCycle: hasNeg, dist };
}
