export interface MeaHooks {
  onOp?: (op: string) => void;
  onApply?: (op: string, state: number[]) => void;
  onGoal?: (state: number[]) => void;
}
export interface MeaProblem {
  start: number[];
  goal: number[];
  ops: Array<{
    name: string;
    diff: (s: number[], g: number[]) => number;
    apply: (s: number[]) => number[];
  }>;
}
export function meansEndAnalysis(p: MeaProblem, hooks: MeaHooks = {}): string[] {
  const plan: string[] = [];
  const solve = (state: number[], goal: number[]): number[] => {
    if (state.every((v, i) => v === goal[i])) {
      hooks.onGoal?.(state);
      return state;
    }
    let best = p.ops[0]!;
    let bestDiff = best.diff(state, goal);
    for (const op of p.ops) {
      const d = op.diff(state, goal);
      if (d < bestDiff) {
        bestDiff = d;
        best = op;
      }
    }
    hooks.onOp?.(best.name);
    const ns = best.apply(state);
    hooks.onApply?.(best.name, ns);
    plan.push(best.name);
    return solve(ns, goal);
  };
  solve(p.start, p.goal);
  return plan;
}
