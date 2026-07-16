// 列表调度 · 实现 (无依赖, 按优先级)
export interface LsHooks {
  onAssign?: (task: number, machine: number) => void;
  onConclude?: (makespan: number) => void;
}
export function listSchedule(
  durations: readonly number[],
  priorities: readonly number[],
  m: number,
  hooks: LsHooks = {},
): { makespan: number; loads: number[] } {
  const order = durations.map((_, i) => i).sort((a, b) => priorities[b]! - priorities[a]!);
  const loads = new Array<number>(m).fill(0);
  for (const t of order) {
    let mi = 0;
    for (let k = 1; k < m; k++) if (loads[k]! < loads[mi]!) mi = k;
    loads[mi]! += durations[t]!;
    hooks.onAssign?.(t, mi);
  }
  const makespan = Math.max(...loads);
  hooks.onConclude?.(makespan);
  return { makespan, loads };
}
