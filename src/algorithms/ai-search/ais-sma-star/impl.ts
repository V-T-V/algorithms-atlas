export interface SmaHooks {
  onExpand?: (node: number, f: number) => void;
  onForget?: (node: number) => void;
}
export interface SmaGraph {
  start: number;
  goal: number;
  neighbors: (n: number) => Array<{ to: number; cost: number }>;
  h: (n: number) => number;
}
export function smaStarSearch(g: SmaGraph, memLimit: number, hooks: SmaHooks = {}): number[] {
  type N = { node: number; g: number; f: number; parent: number | null; backup: number };
  const open: N[] = [{ node: g.start, g: 0, f: g.h(g.start), parent: null, backup: Infinity }];
  const parentMap = new Map<number, number>();
  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const best = open.shift()!;
    hooks.onExpand?.(best.node, best.f);
    if (best.node === g.goal) {
      const path: number[] = [];
      let n: number | null = best.node;
      while (n !== null) {
        path.unshift(n);
        n = parentMap.get(n) ?? null;
      }
      return path;
    }
    for (const e of g.neighbors(best.node)) {
      if (open.length >= memLimit) {
        open.sort((a, b) => b.f - a.f);
        const worst = open.pop()!;
        hooks.onForget?.(worst.node);
      }
      parentMap.set(e.to, best.node);
      open.push({
        node: e.to,
        g: best.g + e.cost,
        f: best.g + e.cost + g.h(e.to),
        parent: best.node,
        backup: Infinity,
      });
    }
  }
  return [];
}
