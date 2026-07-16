// =============================================================================
// 最大流 Edmonds-Karp
// =============================================================================

export interface FlowGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; capacity: number }>;
  source: string;
  sink: string;
}

export interface MaxFlowHooks {
  onAugment?: (path: string[], bottleneck: number, total: number) => void;
  onDone?: (maxFlow: number) => void;
}

export function maxFlow(input: FlowGraphInput, hooks: MaxFlowHooks = {}): number {
  const idx = new Map<string, number>();
  input.nodes.forEach((n, i) => idx.set(n, i));
  const n = input.nodes.length;
  const cap: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (const e of input.edges) {
    const u = idx.get(e.from)!;
    const v = idx.get(e.to)!;
    cap[u]![v]! += e.capacity;
  }
  const s = idx.get(input.source)!;
  const t = idx.get(input.sink)!;
  let total = 0;
  while (true) {
    const parent = new Array<number>(n).fill(-1);
    parent[s] = s;
    const queue: number[] = [s];
    while (queue.length > 0 && parent[t] === -1) {
      const u = queue.shift()!;
      for (let v = 0; v < n; v++) {
        if (parent[v] === -1 && cap[u]![v]! > 0) {
          parent[v] = u;
          queue.push(v);
        }
      }
    }
    if (parent[t] === -1) break;
    // 瓶颈
    let bottleneck = Infinity;
    let cur = t;
    while (cur !== s) {
      const p = parent[cur]!;
      bottleneck = Math.min(bottleneck, cap[p]![cur]!);
      cur = p;
    }
    // 更新残量
    cur = t;
    const path: number[] = [];
    while (cur !== s) {
      const p = parent[cur]!;
      cap[p]![cur]! -= bottleneck;
      cap[cur]![p]! += bottleneck;
      path.push(cur);
      cur = p;
    }
    path.push(s);
    path.reverse();
    total += bottleneck;
    hooks.onAugment?.(
      path.map((x) => input.nodes[x]!),
      bottleneck,
      total,
    );
  }
  hooks.onDone?.(total);
  return total;
}
