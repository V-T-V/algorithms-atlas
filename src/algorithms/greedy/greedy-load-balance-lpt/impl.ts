// LPT 调度 · 实现
export interface LptHooks {
  onAssign?: (job: number, machine: number, load: number) => void;
  onConclude?: (makespan: number) => void;
}
export function lptSchedule(
  jobs: readonly number[],
  m: number,
  hooks: LptHooks = {},
): { loads: number[]; makespan: number } {
  const order = jobs.map((j, i) => ({ i, t: j })).sort((a, b) => b.t - a.t);
  const loads = new Array<number>(m).fill(0);
  for (const { i, t } of order) {
    let mi = 0;
    for (let k = 1; k < m; k++) if (loads[k]! < loads[mi]!) mi = k;
    loads[mi]! += t;
    hooks.onAssign?.(i, mi, loads[mi]!);
  }
  const makespan = Math.max(...loads);
  hooks.onConclude?.(makespan);
  return { loads, makespan };
}
