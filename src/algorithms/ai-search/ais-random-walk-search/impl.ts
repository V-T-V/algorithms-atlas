export interface RwHooks {
  onStep?: (cur: number, next: number) => void;
  onGoal?: (n: number) => void;
}
export interface RwGraph {
  start: number;
  goal: number;
  neighbors: (n: number) => number[];
  rand: () => number;
}
export function randomWalkSearch(g: RwGraph, steps: number, hooks: RwHooks = {}): number[] {
  const path: number[] = [g.start];
  let cur = g.start;
  for (let s = 0; s < steps; s++) {
    if (cur === g.goal) {
      hooks.onGoal?.(cur);
      break;
    }
    const ns = g.neighbors(cur);
    if (!ns.length) break;
    const next = ns[Math.floor(g.rand() * ns.length)]!;
    hooks.onStep?.(cur, next);
    path.push(next);
    cur = next;
  }
  return path;
}
