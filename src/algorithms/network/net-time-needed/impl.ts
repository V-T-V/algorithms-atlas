export interface TnHooks {
  onNode?: (v: number, t: number) => void;
  onResult?: (total: number) => void;
}
export function numOfMinutes(
  n: number,
  headID: number,
  manager: number[],
  informTime: number[],
  hooks: TnHooks = {},
): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) if (manager[i] !== -1) adj[manager[i]!]!.push(i);
  const dfs = (u: number): number => {
    let maxChild = 0;
    for (const v of adj[u]!) maxChild = Math.max(maxChild, dfs(v));
    const t = informTime[u]! + maxChild;
    hooks.onNode?.(u, t);
    return t;
  };
  const r = dfs(headID);
  hooks.onResult?.(r);
  return r;
}
