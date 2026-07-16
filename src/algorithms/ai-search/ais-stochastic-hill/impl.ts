export interface ShcHooks {
  onStep?: (cur: number, val: number) => void;
}
export interface ShcProblem {
  start: number;
  eval: (x: number) => number;
  neighbors: (x: number) => number[];
  rand: () => number;
}
export function stochasticHill(p: ShcProblem, steps: number, hooks: ShcHooks = {}): number {
  let cur = p.start;
  for (let s = 0; s < steps; s++) {
    hooks.onStep?.(cur, p.eval(cur));
    const better = p.neighbors(cur).filter((n) => p.eval(n) > p.eval(cur));
    if (!better.length) break;
    cur = better[Math.floor(p.rand() * better.length)]!;
  }
  return cur;
}
