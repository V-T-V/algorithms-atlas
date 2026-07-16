export interface RtaHooks {
  onStep?: (node: number, next: number) => void;
  onGoal?: (node: number) => void;
}
export interface RtaGraph {
  start: number;
  goal: number;
  neighbors: (n: number) => number[];
  h0: (n: number) => number;
}
export function rtaStarSearch(g: RtaGraph, maxSteps: number, hooks: RtaHooks = {}): number[] {
  const h = new Map<number, number>();
  const get = (n: number) => {
    if (!h.has(n)) h.set(n, g.h0(n));
    return h.get(n)!;
  };
  const path: number[] = [g.start];
  let cur = g.start;
  for (let s = 0; s < maxSteps; s++) {
    if (cur === g.goal) {
      hooks.onGoal?.(cur);
      return path;
    }
    const ns = g.neighbors(cur).map((n) => ({ n, f: get(n) + 1 }));
    ns.sort((a, b) => a.f - b.f);
    if (!ns.length) break;
    h.set(cur, Math.max(ns[0]!.f, ns[1]?.f ?? ns[0]!.f));
    hooks.onStep?.(cur, ns[0]!.n);
    cur = ns[0]!.n;
    path.push(cur);
  }
  return path;
}
