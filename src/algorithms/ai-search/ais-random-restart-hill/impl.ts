export interface RrhcHooks {
  onStep?: (state: number, val: number, restart: number) => void;
  onRestart?: (restart: number) => void;
}
export interface RrhcProblem {
  domain: [number, number];
  eval: (x: number) => number;
  neighbors: (x: number) => number[];
  rand: () => number;
}
export function randomRestartHill(p: RrhcProblem, restarts: number, hooks: RrhcHooks = {}): number {
  let best = p.rand();
  let bestVal = p.eval(best);
  for (let r = 0; r <= restarts; r++) {
    let cur = r === 0 ? best : p.rand();
    hooks.onRestart?.(r);
    let improved = true;
    while (improved) {
      improved = false;
      for (const nb of p.neighbors(cur)) {
        const v = p.eval(nb);
        hooks.onStep?.(nb, v, r);
        if (v > p.eval(cur)) {
          cur = nb;
          improved = true;
        }
      }
    }
    if (p.eval(cur) > bestVal) {
      best = cur;
      bestVal = p.eval(cur);
    }
  }
  return best;
}
