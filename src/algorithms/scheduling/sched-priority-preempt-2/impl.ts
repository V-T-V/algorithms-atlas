// 优先级抢占调度 · 纯算法实现
export interface PriorityPreemptHooks {
  onDispatch?: (pid: string, priority: number, time: number) => void;
  onComplete?: (pid: string, completionTime: number) => void;
  onResult?: (avgWait: number, avgTurnaround: number) => void;
}

export interface PriorityProcess {
  pid: string;
  arrival: number;
  burst: number;
  priority: number; // 数值越小优先级越高
}

export function priorityPreemptive(
  procs: readonly PriorityProcess[],
  hooks: PriorityPreemptHooks = {},
): {
  completion: Record<string, number>;
  waiting: Record<string, number>;
  turnaround: Record<string, number>;
  avgWaiting: number;
  avgTurnaround: number;
  timeline: Array<{ pid: string; start: number; end: number }>;
} {
  const remaining: Record<string, number> = {};
  procs.forEach((p) => (remaining[p.pid] = p.burst));
  const completion: Record<string, number> = {};
  const timeline: Array<{ pid: string; start: number; end: number }> = [];
  let time = 0;
  let done = 0;
  const n = procs.length;
  let lastPid: string | null = null;

  while (done < n) {
    // 选已到达未完成中优先级最高
    let best: PriorityProcess | null = null;
    for (const p of procs) {
      if (p.arrival <= time && remaining[p.pid]! > 0) {
        if (best === null || p.priority < best.priority) best = p;
      }
    }
    if (best === null) {
      time++;
      continue;
    }
    if (lastPid !== best.pid) {
      if (timeline.length > 0 && timeline[timeline.length - 1]!.end === time) {
        // 连续段：合并由调用者决定，这里新起一段
      }
      timeline.push({ pid: best.pid, start: time, end: time + 1 });
      hooks.onDispatch?.(best.pid, best.priority, time);
    } else {
      timeline[timeline.length - 1]!.end = time + 1;
    }
    lastPid = best.pid;
    remaining[best.pid]!--;
    time++;
    if (remaining[best.pid]! === 0) {
      completion[best.pid] = time;
      hooks.onComplete?.(best.pid, time);
      done++;
      lastPid = null;
    }
  }

  const waiting: Record<string, number> = {};
  const turnaround: Record<string, number> = {};
  let tw = 0;
  let tt = 0;
  for (const p of procs) {
    turnaround[p.pid] = completion[p.pid]! - p.arrival;
    waiting[p.pid] = turnaround[p.pid]! - p.burst;
    tw += waiting[p.pid]!;
    tt += turnaround[p.pid]!;
  }
  hooks.onResult?.(tw / n, tt / n);
  return {
    completion,
    waiting,
    turnaround,
    avgWaiting: tw / n,
    avgTurnaround: tt / n,
    timeline,
  };
}
