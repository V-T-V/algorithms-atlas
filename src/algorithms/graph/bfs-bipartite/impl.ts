// =============================================================================
// 二分图判定·BFS 染色（无向图）
// 从未染色节点 BFS，交替染 0/1；遇同色邻居即存在奇环 → 非二分。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface BipartiteHooks {
  onVisit?: (v: string, color: number) => void;
  onConflict?: (u: string, v: string) => void;
  onResult?: (bipartite: boolean, coloring: Map<string, number>) => void;
}

export interface BipartiteResult {
  bipartite: boolean;
  coloring: Map<string, number>;
}

export function bfsBipartite(input: GraphInput, hooks: BipartiteHooks = {}): BipartiteResult {
  const { nodes, edges } = input;

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to)) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const color = new Map<string, number>(); // -1 未染；0/1 两色
  for (const n of nodes) color.set(n, -1);
  let ok = true;

  for (const start of nodes) {
    if (color.get(start) !== -1) continue;
    const queue: string[] = [start];
    color.set(start, 0);
    hooks.onVisit?.(start, 0);
    while (queue.length > 0) {
      const u = queue.shift()!;
      const uc = color.get(u) ?? -1;
      for (const v of adj.get(u) ?? []) {
        const vc = color.get(v) ?? -1;
        if (vc === -1) {
          const nc = 1 - uc;
          color.set(v, nc);
          queue.push(v);
          hooks.onVisit?.(v, nc);
        } else if (vc === uc) {
          ok = false;
          hooks.onConflict?.(u, v);
        }
      }
    }
  }

  hooks.onResult?.(ok, color);
  return { bipartite: ok, coloring: color };
}
