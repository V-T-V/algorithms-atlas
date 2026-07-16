// EDF Scheduling v2 · 纯算法实现
// 抢占式最早截止期优先 (Preemptive Earliest Deadline First)。
// 每个时间单位在已到达且未完成的任务中，挑选截止期最早的任务运行 1 单位。

export interface EdfTask {
  pid: string;
  arrival: number;
  execution: number;
  /** 绝对截止期：任务必须在此时刻之前完成。 */
  deadline: number;
}

export interface EdfHooks {
  onDispatch?: (pid: string, time: number) => void;
}

export interface EdfResult {
  completion: Record<string, number>;
  allDeadlinesMet: boolean;
}

export function edfSchedule(tasks: EdfTask[], hooks?: EdfHooks): EdfResult {
  const remaining: Record<string, number> = {};
  const completion: Record<string, number> = {};
  for (const t of tasks) remaining[t.pid] = t.execution;

  const pending = new Set(tasks.map((t) => t.pid));
  const totalExec = tasks.reduce((s, t) => s + t.execution, 0);
  const maxArrival = tasks.length ? Math.max(...tasks.map((t) => t.arrival)) : 0;

  let time = 0;
  let allDeadlinesMet = true;

  while (pending.size > 0) {
    // 在已到达且未完成的任务里挑截止期最早者；同截止期按输入顺序破平局。
    let best: EdfTask | undefined;
    for (const t of tasks) {
      if (!pending.has(t.pid)) continue;
      if (t.arrival <= time && (!best || t.deadline < best.deadline)) best = t;
    }
    if (!best) {
      // 无就绪任务，跳到下一个到达时刻。
      const future = tasks
        .filter((t) => pending.has(t.pid) && t.arrival > time)
        .map((t) => t.arrival);
      time = future.length ? Math.min(...future) : time + 1;
      continue;
    }

    hooks?.onDispatch?.(best.pid, time);
    remaining[best.pid] = (remaining[best.pid] ?? 0) - 1;
    time += 1;
    if (remaining[best.pid] === 0) {
      completion[best.pid] = time;
      if (time > best.deadline) allDeadlinesMet = false;
      pending.delete(best.pid);
    }

    // 安全阀，防止意外死循环。
    if (time > maxArrival + totalExec + 1000) break;
  }

  return { completion, allDeadlinesMet };
}
