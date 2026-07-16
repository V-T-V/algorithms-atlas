// LLF Scheduling v2 · 纯算法实现
// 最低松弛度优先 (Least Laxity First)：每个时间单位选松弛度最小的就绪任务运行。
// 松弛度 = deadline - time - remaining_execution

export interface LlfTask {
  pid: string;
  arrival: number;
  execution: number;
  deadline: number;
}

export interface LlfHooks {
  onDispatch?: (pid: string, time: number) => void;
}

export function llfSchedule(
  tasks: LlfTask[],
  hooks?: LlfHooks,
): { completion: Record<string, number>; allDeadlinesMet: boolean } {
  const remaining = new Map<string, number>();
  const completion: Record<string, number> = {};
  let allDeadlinesMet = true;

  for (const t of tasks) remaining.set(t.pid, t.execution);

  let time = 0;
  const totalExec = tasks.reduce((s, t) => s + t.execution, 0);
  const maxArrival = tasks.length ? Math.max(...tasks.map((t) => t.arrival)) : 0;
  const pending = new Set(tasks.map((t) => t.pid));

  while (pending.size > 0) {
    let best: LlfTask | undefined;
    let bestLax = Infinity;

    for (const t of tasks) {
      if (!pending.has(t.pid)) continue;
      if (t.arrival > time) continue;
      const laxity = t.deadline - time - (remaining.get(t.pid) ?? 0);
      if (laxity < bestLax) {
        bestLax = laxity;
        best = t;
      }
    }

    if (!best) {
      const future = tasks
        .filter((t) => pending.has(t.pid) && t.arrival > time)
        .map((t) => t.arrival);
      time = future.length ? Math.min(...future) : time + 1;
      continue;
    }

    hooks?.onDispatch?.(best.pid, time);
    remaining.set(best.pid, (remaining.get(best.pid) ?? 0) - 1);
    time += 1;

    if ((remaining.get(best.pid) ?? 0) <= 0) {
      completion[best.pid] = time;
      if (time > best.deadline) allDeadlinesMet = false;
      pending.delete(best.pid);
    }

    if (time > maxArrival + totalExec + 1000) break;
  }

  return { completion, allDeadlinesMet };
}
