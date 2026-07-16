// GRASP (路径构造) · 实现
export interface GrHooks {
  onIter?: (i: number, sol: number[], cost: number) => void;
  onConclude?: (best: number[], bestCost: number) => void;
}
export function grasp(
  dist: ReadonlyArray<readonly number[]>,
  n: number,
  rounds = 20,
  alpha = 0.3,
  hooks: GrHooks = {},
): { best: number[]; bestCost: number } {
  let best: number[] = [],
    bestCost = Infinity;
  for (let r = 0; r < rounds; r++) {
    const unvisited = new Set<number>(Array.from({ length: n }, (_, i) => i));
    const sol: number[] = [];
    let cur = 0;
    unvisited.delete(0);
    sol.push(0);
    while (unvisited.size > 0) {
      const cands = [...unvisited].map((j) => ({ j, d: dist[cur]![j]! })).sort((a, b) => a.d - b.d);
      const cut = Math.max(1, Math.floor(cands.length * alpha));
      const pick = cands[Math.floor(Math.random() * cut)]!;
      cur = pick.j;
      sol.push(cur);
      unvisited.delete(cur);
    }
    sol.push(0);
    let cost = 0;
    for (let i = 0; i + 1 < sol.length; i++) cost += dist[sol[i]!]![sol[i + 1]!]!;
    hooks.onIter?.(r, sol, cost);
    if (cost < bestCost) {
      bestCost = cost;
      best = sol;
    }
  }
  hooks.onConclude?.(best, bestCost);
  return { best, bestCost };
}
