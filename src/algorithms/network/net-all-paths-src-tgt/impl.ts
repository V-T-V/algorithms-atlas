export interface ApHooks {
  onPath?: (p: number[]) => void;
  onResult?: (n: number) => void;
}
export function allPathsSourceTarget(graph: number[][], hooks: ApHooks = {}): number[][] {
  const n = graph.length;
  const out: number[][] = [];
  const path: number[] = [0];
  const dfs = (u: number) => {
    if (u === n - 1) {
      out.push([...path]);
      hooks.onPath?.([...path]);
      return;
    }
    for (const v of graph[u] ?? []) {
      path.push(v);
      dfs(v);
      path.pop();
    }
  };
  dfs(0);
  hooks.onResult?.(out.length);
  return out;
}
