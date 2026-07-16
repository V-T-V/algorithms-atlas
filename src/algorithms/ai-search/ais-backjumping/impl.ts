export interface CbjHooks {
  onAssign?: (varIdx: number, val: number) => void;
  onJump?: (from: number, to: number) => void;
  onFound?: (assign: number[]) => void;
}
export interface Csp {
  vars: number[];
  domain: number[];
  consistent: (partial: Map<number, number>, varIdx: number, val: number) => boolean;
}
export function conflictBackjumping(csp: Csp, hooks: CbjHooks = {}): number[] | null {
  const assign = new Map<number, number>();
  const conf = (i: number) =>
    Array.from({ length: i }, (_, k) => k).filter(
      (k) =>
        csp.consistent(assign, i, assign.get(k)! + 0) === false ||
        (!csp.consistent(assign, i, assign.get(i) ?? -1) && false),
    );
  const conflictSet = new Map<number, Set<number>>();
  const solve = (i: number): number[] | null => {
    if (i >= csp.vars.length) return [...assign.values()];
    const cs = new Set<number>();
    for (const v of csp.domain) {
      let ok = true;
      for (let k = 0; k < i; k++)
        if (!csp.consistent(assign, i, v)) {
          ok = false;
          cs.add(k);
          break;
        }
      hooks.onAssign?.(i, v);
      if (csp.consistent(assign, i, v)) {
        assign.set(i, v);
        const r = solve(i + 1);
        if (r) return r;
        assign.delete(i);
      }
    }
    // 合并子层冲突集
    for (const k of conflictSet.get(i) ?? []) cs.add(k);
    // 找最大冲突变量
    let jump = -1;
    for (const k of cs) if (k > jump) jump = k;
    if (jump < 0) return null;
    hooks.onJump?.(i, jump);
    for (let k = jump + 1; k <= i; k++) conflictSet.delete(k);
    const target = conflictSet.get(jump) ?? new Set<number>();
    cs.forEach((x) => {
      if (x !== jump) target.add(x);
    });
    conflictSet.set(jump, target);
    return solve(jump);
  };
  const r = solve(0);
  if (r) hooks.onFound?.(r);
  return r;
}
