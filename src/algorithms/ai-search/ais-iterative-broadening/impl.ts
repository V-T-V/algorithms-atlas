export interface IbHooks {
  onVisit?: (node: number, depth: number, cap: number) => void;
  onFound?: (node: number) => void;
}
export interface IbTree {
  root: number;
  goal: number;
  children: (n: number) => number[];
  maxBranch: number;
  maxDepth: number;
}
export function iterativeBroadening(t: IbTree, hooks: IbHooks = {}): number[] {
  for (let cap = 1; cap <= t.maxBranch; cap++) {
    const path: number[] = [];
    const dfs = (n: number, d: number): boolean => {
      if (d > t.maxDepth) return false;
      hooks.onVisit?.(n, d, cap);
      path.push(n);
      if (n === t.goal) {
        hooks.onFound?.(n);
        return true;
      }
      const kids = t.children(n).slice(0, cap);
      for (const c of kids) if (dfs(c, d + 1)) return true;
      path.pop();
      return false;
    };
    if (dfs(t.root, 0)) return path;
  }
  return [];
}
