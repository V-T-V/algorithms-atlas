// 约束传播搜索（AC-3 + 回溯）· 实现
export type Domain = number[];
export interface CspProblem {
  variables: string[];
  domains: Record<string, Domain>;
  /** 约束：两变量取某值是否冲突。无冲突返回 true。 */
  consistent: (a: string, va: number, b: string, vb: number) => boolean;
  neighbors: Record<string, string[]>;
}
export interface CspHooks {
  onAssign?: (varName: string, value: number) => void;
  onPropagate?: (varName: string, removed: number) => void;
  onBacktrack?: (varName: string) => void;
  onSolution?: (assignment: Record<string, number>) => void;
}
function revise(p: CspProblem, xi: string, xj: string, domains: Record<string, Domain>): number {
  let removed = 0;
  const di = domains[xi]!;
  const dj = domains[xj]!;
  const keep: number[] = [];
  for (const v of di) {
    if (dj.some((w) => p.consistent(xi, v, xj, w))) keep.push(v);
    else removed++;
  }
  domains[xi] = keep;
  return removed;
}
/** AC-3 在 domains 上做弧一致性（不修改原 domains）。 */
export function ac3(p: CspProblem, domains: Record<string, Domain>, hooks?: CspHooks): boolean {
  const d: Record<string, Domain> = {};
  for (const v of p.variables) d[v] = [...domains[v]!];
  const queue: Array<[string, string]> = [];
  for (const xi of p.variables) for (const xj of p.neighbors[xi]!) queue.push([xi, xj]);
  while (queue.length) {
    const [xi, xj] = queue.shift()!;
    const r = revise(p, xi, xj, d);
    if (r > 0) hooks?.onPropagate?.(xi, r);
    if (d[xi]!.length === 0) return false;
    if (r > 0) {
      for (const xk of p.neighbors[xi]!) if (xk !== xj) queue.push([xk, xi]);
    }
  }
  for (const v of p.variables) domains[v] = [...d[v]!];
  return true;
}
export function solveCsp(p: CspProblem, hooks: CspHooks = {}): Record<string, number> | null {
  const assignment: Record<string, number> = {};
  const domains: Record<string, Domain> = {};
  for (const v of p.variables) domains[v] = [...p.domains[v]!];
  const vars = [...p.variables];
  const backtrack = (idx: number): boolean => {
    if (idx >= vars.length) {
      hooks.onSolution?.({ ...assignment });
      return true;
    }
    const v = vars[idx]!;
    for (const value of domains[v]!) {
      assignment[v] = value;
      hooks.onAssign?.(v, value);
      const saved: Record<string, Domain> = {};
      for (const u of p.variables) saved[u] = [...domains[u]!];
      // 将已赋值变量的域置为单一已赋值，使 AC-3 能传播该约束
      for (const u of Object.keys(assignment)) domains[u] = [assignment[u]!];
      if (ac3(p, domains)) {
        if (backtrack(idx + 1)) return true;
      }
      for (const u of p.variables) domains[u] = saved[u]!;
      delete assignment[v];
      hooks.onBacktrack?.(v);
    }
    return false;
  };
  ac3(p, domains, hooks);
  return backtrack(0) ? assignment : null;
}
