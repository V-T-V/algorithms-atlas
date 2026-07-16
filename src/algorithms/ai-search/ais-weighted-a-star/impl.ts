export interface WaHooks {
  onExpand?: (node: number, g: number, f: number) => void;
  onFound?: (node: number) => void;
}
export interface WaGraph {
  start: number;
  goal: number;
  neighbors: (n: number) => Array<{ to: number; cost: number }>;
  h: (n: number) => number;
}
export function weightedAStar(g: WaGraph, W: number, hooks: WaHooks = {}): number[] {
  type N = { n: number; g: number; f: number };
  const open: N[] = [{ n: g.start, g: 0, f: W * g.h(g.start) }];
  const parent = new Map<number, number>();
  const gC = new Map<number, number>([[g.start, 0]]);
  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const cur = open.shift()!;
    hooks.onExpand?.(cur.n, cur.g, cur.f);
    if (cur.n === g.goal) {
      hooks.onFound?.(cur.n);
      const path: number[] = [];
      let c: number | undefined = g.goal;
      while (c !== undefined) {
        path.unshift(c);
        c = parent.get(c);
      }
      return path;
    }
    for (const e of g.neighbors(cur.n)) {
      const ng = cur.g + e.cost;
      if (ng < (gC.get(e.to) ?? Infinity)) {
        gC.set(e.to, ng);
        parent.set(e.to, cur.n);
        open.push({ n: e.to, g: ng, f: ng + W * g.h(e.to) });
      }
    }
  }
  return [];
}
