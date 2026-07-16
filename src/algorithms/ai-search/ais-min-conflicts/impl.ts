export interface McHooks {
  onStep?: (varIdx: number, newVal: number, conflicts: number) => void;
  onSolved?: (assign: number[]) => void;
}
export interface McProblem {
  n: number;
  domain: number[];
  conflicts: (assign: number[], i: number, val: number) => number;
  rand: () => number;
}
export function minConflicts(
  p: McProblem,
  maxSteps: number,
  init: number[],
  hooks: McHooks = {},
): number[] | null {
  const assign = [...init];
  const conflicted = () =>
    assign.map((_, i) => i).filter((i) => p.conflicts(assign, i, assign[i]!) > 0);
  for (let s = 0; s < maxSteps; s++) {
    const cs = conflicted();
    if (!cs.length) {
      hooks.onSolved?.(assign);
      return assign;
    }
    const i = cs[Math.floor(p.rand() * cs.length)]!;
    let bestV = assign[i]!;
    let bestC = p.conflicts(assign, i, bestV);
    for (const v of p.domain) {
      const c = p.conflicts(assign, i, v);
      if (c < bestC) {
        bestC = c;
        bestV = v;
      }
    }
    assign[i] = bestV;
    hooks.onStep?.(i, bestV, bestC);
  }
  return conflicted().length ? null : assign;
}
