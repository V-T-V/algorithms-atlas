export interface LrtaHooks {
  onStep?: (node: number, h: number) => void;
  onGoal?: (node: number) => void;
}
export interface LrtaGraph {
  start: number;
  goal: number;
  neighbors: (n: number) => number[];
  h0: (n: number) => number;
}
export function lrtaStarSearch(g: LrtaGraph, maxSteps: number, hooks: LrtaHooks = {}): number[] {
  const h = new Map<number, number>();
  for (let n = 0; ; n++) {
    h.set(n, g.h0(n));
    if (n > 1000) break;
  }
  const path: number[] = [g.start];
  let cur = g.start;
  for (let s = 0; s < maxSteps; s++) {
    hooks.onStep?.(cur, h.get(cur) ?? 0);
    if (cur === g.goal) {
      hooks.onGoal?.(cur);
      return path;
    }
    const ns = g.neighbors(cur);
    if (!ns.length) break;
    let best = ns[0]!;
    let bestF = (h.get(best) ?? 0) + 1;
    for (const n of ns) {
      const f = (h.get(n) ?? 0) + 1;
      if (f < bestF) {
        bestF = f;
        best = n;
      }
    }
    h.set(cur, bestF);
    path.push(best);
    cur = best;
  }
  return path;
}
