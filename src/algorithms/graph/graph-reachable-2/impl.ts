// =============================================================================
// 可达节点 · 纯算法实现（BFS）
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  directed?: boolean;
}

export interface ReachableHooks {
  onVisit?: (node: string, order: number) => void;
  onDone?: (reachable: string[]) => void;
}

export function reachableNodes(
  input: GraphInput,
  source: string,
  hooks: ReachableHooks = {},
): string[] {
  const adj = new Map<string, Set<string>>();
  for (const n of input.nodes) adj.set(n, new Set());
  for (const e of input.edges) {
    adj.get(e.from)?.add(e.to);
    if (!input.directed) adj.get(e.to)?.add(e.from);
  }
  if (!adj.has(source)) {
    hooks.onDone?.([]);
    return [];
  }
  const visited = new Set<string>([source]);
  const queue: string[] = [source];
  const order: string[] = [];
  let ord = 0;
  hooks.onVisit?.(source, ord++);
  order.push(source);
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of adj.get(u) ?? []) {
      if (visited.has(v)) continue;
      visited.add(v);
      hooks.onVisit?.(v, ord++);
      order.push(v);
      queue.push(v);
    }
  }
  hooks.onDone?.(order);
  return order;
}
