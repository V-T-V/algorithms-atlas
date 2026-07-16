// IDA* · 实现
export interface IdaHooks {
  onVisit?: (node: number, g: number, f: number) => void;
  onThreshold?: (threshold: number) => void;
  onFound?: (node: number, g: number) => void;
}
export interface IdaGraph {
  start: number;
  goal: number;
  neighbors: (n: number) => Array<{ to: number; cost: number }>;
  h: (n: number) => number;
}
export function idaStarSearch(g: IdaGraph, hooks: IdaHooks = {}): number[] {
  let threshold = g.h(g.start);
  hooks.onThreshold?.(threshold);
  const path: number[] = [];
  const dfs = (node: number, gCost: number): number => {
    const f = gCost + g.h(node);
    hooks.onVisit?.(node, gCost, f);
    if (f > threshold) return f;
    if (node === g.goal) {
      hooks.onFound?.(node, gCost);
      return -1;
    }
    path.push(node);
    let min = Infinity;
    for (const e of g.neighbors(node)) {
      const t = dfs(e.to, gCost + e.cost);
      if (t === -1) return -1;
      if (t < min) min = t;
    }
    path.pop();
    return min;
  };
  while (true) {
    const t = dfs(g.start, 0);
    if (t === -1) return path;
    if (t === Infinity) return [];
    threshold = t;
    hooks.onThreshold?.(threshold);
  }
}
