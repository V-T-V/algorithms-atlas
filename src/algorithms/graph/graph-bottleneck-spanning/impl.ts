// =============================================================================
// 瓶颈生成树 · 纯算法实现（Kruskal 求 MST，取最大边）
// =============================================================================

export interface WeightedGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

export interface BottleneckHooks {
  onAddEdge?: (from: string, to: string, weight: number) => void;
  onDone?: (bottleneck: number, totalWeight: number) => void;
}

export interface BottleneckResult {
  bottleneck: number; // MST 中最大边权
  totalWeight: number;
  connected: boolean;
}

export function bottleneckSpanningTree(
  input: WeightedGraphInput,
  hooks: BottleneckHooks = {},
): BottleneckResult {
  const sorted = [...input.edges].sort((a, b) => a.weight - b.weight);
  const parent = new Map<string, string>();
  for (const n of input.nodes) parent.set(n, n);
  const find = (x: string): string => {
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)!)!);
      x = parent.get(x)!;
    }
    return x;
  };
  let bottleneck = 0;
  let total = 0;
  let count = 0;
  const used: Array<{ from: string; to: string; weight: number }> = [];
  for (const e of sorted) {
    const ra = find(e.from);
    const rb = find(e.to);
    if (ra !== rb) {
      parent.set(ra, rb);
      total += e.weight;
      if (e.weight > bottleneck) bottleneck = e.weight;
      used.push({ from: e.from, to: e.to, weight: e.weight });
      count++;
      hooks.onAddEdge?.(e.from, e.to, e.weight);
    }
  }
  const connected = count === input.nodes.length - 1;
  hooks.onDone?.(bottleneck, total);
  return { bottleneck, totalWeight: total, connected };
}
