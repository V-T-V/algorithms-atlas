export interface AgHooks {
  onPush?: (v: number) => void;
  onResult?: (p: number[]) => void;
}
export function allPaths(
  graph: number[][],
  src: number,
  dst: number,
  hooks: AgHooks = {},
): number[][] {
  const out: number[][] = [];
  const cur: number[] = [src];
  const visited = new Set<number>([src]);
  const dfs = (u: number) => {
    if (u === dst) {
      out.push([...cur]);
      hooks.onResult?.([...cur]);
      return;
    }
    for (const v of graph[u] ?? []) {
      if (visited.has(v)) continue;
      visited.add(v);
      cur.push(v);
      hooks.onPush?.(v);
      dfs(v);
      cur.pop();
      visited.delete(v);
    }
  };
  dfs(src);
  return out;
}
