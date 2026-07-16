// 时间片轮转（可变量子）· 纯算法实现
export interface RRQuantumHooks {
  onDispatch?: (pid: string, run: number, remaining: number, time: number) => void;
  onComplete?: (pid: string, completionTime: number) => void;
  onResult?: (avgWait: number, avgTurnaround: number) => void;
}

export interface RRProcess {
  pid: string;
  arrival: number;
  burst: number;
  quantum: number; // 该进程的时间片
}

export interface RRResult {
  completion: Record<string, number>;
  waiting: Record<string, number>;
  turnaround: Record<string, number>;
  avgWaiting: number;
  avgTurnaround: number;
  timeline: Array<{ pid: string; start: number; end: number }>;
}

export function roundRobinQuantum(
  procs: readonly RRProcess[],
  hooks: RRQuantumHooks = {},
): RRResult {
  const remaining: Record<string, number> = {};
  procs.forEach((p) => (remaining[p.pid] = p.burst));
  const arrived = [...procs].sort((a, b) => a.arrival - b.arrival);
  const queue: RRProcess[] = [];
  const completion: Record<string, number> = {};
  const timeline: Array<{ pid: string; start: number; end: number }> = [];
  let time = 0;
  let idx = 0;
  const inQueue = new Set<string>();

  while (idx < arrived.length || queue.length > 0) {
    // 入队已到达但未入队的进程
    while (idx < arrived.length && arrived[idx]!.arrival <= time) {
      queue.push(arrived[idx]!);
      inQueue.add(arrived[idx]!.pid);
      idx++;
    }
    if (queue.length === 0) {
      // CPU 空闲，跳到下一个到达
      time = arrived[idx]!.arrival;
      continue;
    }
    const cur = queue.shift()!;
    inQueue.delete(cur.pid);
    const run = Math.min(cur.quantum, remaining[cur.pid]!);
    hooks.onDispatch?.(cur.pid, run, remaining[cur.pid]! - run, time);
    timeline.push({ pid: cur.pid, start: time, end: time + run });
    time += run;
    remaining[cur.pid]! -= run;
    // 运行期间新到达的进程入队
    while (idx < arrived.length && arrived[idx]!.arrival <= time) {
      queue.push(arrived[idx]!);
      inQueue.add(arrived[idx]!.pid);
      idx++;
    }
    if (remaining[cur.pid]! > 0) {
      queue.push(cur);
      inQueue.add(cur.pid);
    } else {
      completion[cur.pid] = time;
      hooks.onComplete?.(cur.pid, time);
    }
  }

  const waiting: Record<string, number> = {};
  const turnaround: Record<string, number> = {};
  let totalWait = 0;
  let totalTurn = 0;
  for (const p of procs) {
    turnaround[p.pid] = completion[p.pid]! - p.arrival;
    waiting[p.pid] = turnaround[p.pid]! - p.burst;
    totalWait += waiting[p.pid]!;
    totalTurn += turnaround[p.pid]!;
  }
  const res: RRResult = {
    completion,
    waiting,
    turnaround,
    avgWaiting: totalWait / procs.length,
    avgTurnaround: totalTurn / procs.length,
    timeline,
  };
  hooks.onResult?.(res.avgWaiting, res.avgTurnaround);
  return res;
}
