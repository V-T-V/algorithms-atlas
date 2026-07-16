// =============================================================================
// 拓扑排序（Kahn）
// =============================================================================

export interface DagGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface TopoHooks {
  onPick?: (u: string, indeg: number) => void;
  onDecrement?: (from: string, to: string, newIndeg: number) => void;
  onDone?: (order: string[], hasCycle: boolean) => void;
}

export function topologicalSort(
  input: DagGraphInput,
  hooks: TopoHooks = {},
): { order: string[]; hasCycle: boolean } {
  const adj = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  for (const n of input.nodes) {
    adj.set(n, []);
    indeg.set(n, 0);
  }
  for (const e of input.edges) {
    adj.get(e.from)?.push(e.to);
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1);
  }
  for (const list of adj.values()) list.sort();
  const queue: string[] = [];
  for (const n of input.nodes) if ((indeg.get(n) ?? 0) === 0) queue.push(n);
  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    hooks.onPick?.(u, 0);
    for (const v of adj.get(u) ?? []) {
      const ni = (indeg.get(v) ?? 0) - 1;
      indeg.set(v, ni);
      hooks.onDecrement?.(u, v, ni);
      if (ni === 0) queue.push(v);
    }
  }
  const hasCycle = order.length < input.nodes.length;
  hooks.onDone?.(order, hasCycle);
  return { order, hasCycle };
}
