export interface LdsHooks {
  onVisit?: (node: number, depth: number, discrepancy: number) => void;
  onFound?: (node: number) => void;
}
export interface LdsTree {
  root: number;
  goal: number;
  order: (n: number) => number[];
  maxDepth: number;
}
export function ldsSearch(t: LdsTree, maxDiscrepancy: number, hooks: LdsHooks = {}): number[] {
  const path: number[] = [];
  const dfs = (n: number, d: number, disc: number): boolean => {
    hooks.onVisit?.(n, d, disc);
    path.push(n);
    if (n === t.goal) {
      hooks.onFound?.(n);
      return true;
    }
    if (d >= t.maxDepth) {
      path.pop();
      return false;
    }
    const kids = t.order(n);
    for (let i = 0; i < kids.length; i++) {
      const need = i; // 偏离 i 次才到这个孩子
      if (disc + need > maxDiscrepancy) continue;
      if (dfs(kids[i]!, d + 1, disc + need)) return true;
    }
    path.pop();
    return false;
  };
  if (dfs(t.root, 0, 0)) return path;
  return [];
}
