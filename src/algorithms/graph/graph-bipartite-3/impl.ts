// =============================================================================
// 二分图判定（BFS 染色）
// =============================================================================

export interface BipGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface BipartiteHooks {
  onColor?: (u: string, color: number) => void;
  onConflict?: (u: string, v: string) => void;
  onDone?: (bipartite: boolean, color: Map<string, number>) => void;
}

export function isBipartite(
  input: BipGraphInput,
  hooks: BipartiteHooks = {},
): { bipartite: boolean; color: Map<string, number> } {
  const adj = new Map<string, string[]>();
  for (const n of input.nodes) adj.set(n, []);
  for (const e of input.edges) {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
  }
  for (const list of adj.values()) list.sort();
  const color = new Map<string, number>(); // -1 未染，0/1 两色
  for (const n of input.nodes) color.set(n, -1);
  let ok = true;
  for (const start of input.nodes) {
    if (color.get(start) !== -1) continue;
    color.set(start, 0);
    hooks.onColor?.(start, 0);
    const queue: string[] = [start];
    while (queue.length > 0) {
      const u = queue.shift()!;
      const cu = color.get(u)!;
      for (const v of adj.get(u) ?? []) {
        if (color.get(v) === -1) {
          color.set(v, 1 - cu);
          hooks.onColor?.(v, 1 - cu);
          queue.push(v);
        } else if (color.get(v) === cu) {
          ok = false;
          hooks.onConflict?.(u, v);
        }
      }
    }
    if (!ok) break;
  }
  hooks.onDone?.(ok, color);
  return { bipartite: ok, color };
}
