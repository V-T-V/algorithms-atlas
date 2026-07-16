export interface DStarHooks {
  onExpand?: (node: number, rhs: number) => void;
  onPath?: (path: number[]) => void;
}
export interface DStarGraph {
  start: number;
  goal: number;
  pred: (n: number) => Array<{ from: number; cost: number }>;
  succ: (n: number) => Array<{ to: number; cost: number }>;
  h: (n: number) => number;
}
export function dStarLite(g: DStarGraph, hooks: DStarHooks = {}): number[] {
  const g1 = new Map<number, number>();
  const rhs = new Map<number, number>();
  const get = (m: Map<number, number>, n: number) => m.get(n) ?? Infinity;
  rhs.set(g.goal, 0);
  const pq: Array<{ k: [number, number]; node: number }> = [{ k: [g.h(g.goal), 0], node: g.goal }];
  const pop = () => {
    pq.sort((a, b) => a.k[0] - b.k[0] || a.k[1] - b.k[1]);
    return pq.shift()!;
  };
  const key = (n: number): [number, number] => {
    const gg = get(g1, n);
    const rr = get(rhs, n);
    return [Math.min(gg, rr) + g.h(n), Math.min(gg, rr)];
  };
  const update = (u: number) => {
    if (g1.get(u) !== rhs.get(u)) pq.push({ k: key(u), node: u });
  };
  while (pq.length) {
    const { node: u } = pop();
    hooks.onExpand?.(u, get(rhs, u));
    if (u === g.start && get(g1, u) === get(rhs, u)) break;
    for (const p of g.pred(u)) {
      const cand = p.cost + get(g1, u);
      if (cand < get(rhs, p.from)) {
        rhs.set(p.from, cand);
        update(p.from);
      }
    }
    g1.set(u, get(rhs, u));
  }
  const path: number[] = [];
  let cur = g.start;
  for (let i = 0; i < 100 && cur !== g.goal; i++) {
    path.push(cur);
    let best = -1;
    let bestC = Infinity;
    for (const s of g.succ(cur)) {
      const c = s.cost + get(g1, s.to);
      if (c < bestC) {
        bestC = c;
        best = s.to;
      }
    }
    if (best < 0) break;
    cur = best;
  }
  path.push(g.goal);
  hooks.onPath?.(path);
  return path;
}
