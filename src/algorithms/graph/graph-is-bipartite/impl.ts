// =============================================================================
// 判定二分图 · 纯算法实现（BFS 染色）
// =============================================================================

export interface IsBipartiteHooks {
  onColor?: (node: number, color: number) => void;
  onConflict?: (a: number, b: number) => void;
  onResult?: (bipartite: boolean) => void;
}

export function isBipartite(graph: number[][], hooks: IsBipartiteHooks = {}): boolean {
  const n = graph.length;
  const color: number[] = new Array<number>(n).fill(-1); // -1 未染，0/1 两色
  for (let start = 0; start < n; start++) {
    if (color[start]! !== -1) continue;
    color[start] = 0;
    hooks.onColor?.(start, 0);
    const queue: number[] = [start];
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of graph[u]!) {
        if (color[v]! === -1) {
          color[v] = 1 - color[u]!;
          hooks.onColor?.(v, color[v]!);
          queue.push(v);
        } else if (color[v] === color[u]) {
          hooks.onConflict?.(u, v);
          hooks.onResult?.(false);
          return false;
        }
      }
    }
  }
  hooks.onResult?.(true);
  return true;
}
