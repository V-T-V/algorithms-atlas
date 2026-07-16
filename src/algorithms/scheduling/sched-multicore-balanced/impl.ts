// 多核均衡调度 LPT · 实现

export interface McTask {
  id: string;
  duration: number;
}

export interface McResult {
  assignment: Array<{ id: string; core: number; start: number; finish: number }>;
  coreLoads: number[];
  makespan: number;
}

export interface McHooks {
  onAssign?: (taskId: string, core: number, load: number) => void;
}

/** LPT：降序排列，每次给最小负载核。 */
export function scheduleMulticoreBalanced(
  tasks: McTask[],
  nCores: number,
  hooks: McHooks = {},
): McResult {
  const sorted = [...tasks].sort((a, b) => b.duration - a.duration);
  const coreLoads = new Array(nCores).fill(0);
  const assignment: Array<{ id: string; core: number; start: number; finish: number }> = [];
  for (const t of sorted) {
    let minCore = 0;
    for (let c = 1; c < nCores; c++) if (coreLoads[c]! < coreLoads[minCore]!) minCore = c;
    const start = coreLoads[minCore]!;
    const finish = start + t.duration;
    coreLoads[minCore]! = finish;
    assignment.push({ id: t.id, core: minCore, start, finish });
    hooks.onAssign?.(t.id, minCore, finish);
  }
  return { assignment, coreLoads, makespan: Math.max(...coreLoads) };
}
