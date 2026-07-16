// 最短已运行时间优先 · 实现

export interface SetJob {
  id: string;
  arrival: number;
  burst: number;
}

export interface SetSegment {
  id: string;
  start: number;
  finish: number;
}

export interface SetStat {
  id: string;
  finish: number;
  waiting: number;
  turnaround: number;
}

export interface SetResult {
  segments: SetSegment[];
  stats: SetStat[];
  avgWaiting: number;
  avgTurnaround: number;
}

export interface SetHooks {
  onPick?: (id: string, elapsed: number, time: number) => void;
  onComplete?: (id: string, finish: number) => void;
}

/**
 * 每个时间片选累计运行时间最少的就绪进程运行 quantum 单位（或剩余，取小）。
 */
export function shortestElapsed(jobs: SetJob[], quantum: number, hooks: SetHooks = {}): SetResult {
  const remaining = new Map<string, number>();
  const elapsed = new Map<string, number>();
  const jobMap = new Map<string, SetJob>();
  for (const j of jobs) {
    remaining.set(j.id, j.burst);
    elapsed.set(j.id, 0);
    jobMap.set(j.id, j);
  }
  const arrivalOrder = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let arrivalIdx = 0;
  let now = arrivalOrder[0]?.arrival ?? 0;
  const segments: SetSegment[] = [];
  const finishTime = new Map<string, number>();
  const done = new Set<string>();

  while (done.size < jobs.length) {
    while (arrivalIdx < arrivalOrder.length && arrivalOrder[arrivalIdx]!.arrival <= now)
      arrivalIdx++;
    const ready = arrivalOrder
      .slice(0, arrivalIdx)
      .filter((j) => !done.has(j.id) && remaining.get(j.id)! > 0);
    if (ready.length === 0) {
      if (arrivalIdx >= arrivalOrder.length) break;
      now = arrivalOrder[arrivalIdx]!.arrival;
      continue;
    }
    ready.sort((a, b) => elapsed.get(a.id)! - elapsed.get(b.id)! || a.id.localeCompare(b.id));
    const job = ready[0]!;
    const rem = remaining.get(job.id)!;
    const run = Math.min(quantum, rem);
    const start = now;
    const finish = start + run;
    hooks.onPick?.(job.id, elapsed.get(job.id)!, start);
    segments.push({ id: job.id, start, finish });
    remaining.set(job.id, rem - run);
    elapsed.set(job.id, elapsed.get(job.id)! + run);
    now = finish;
    if (remaining.get(job.id)! === 0) {
      done.add(job.id);
      finishTime.set(job.id, finish);
      hooks.onComplete?.(job.id, finish);
    }
  }

  const stats = jobs.map((j) => {
    const finish = finishTime.get(j.id) ?? 0;
    const turnaround = finish - j.arrival;
    return { id: j.id, finish, waiting: turnaround - j.burst, turnaround };
  });
  const avgWaiting = stats.reduce((s, x) => s + x.waiting, 0) / (jobs.length || 1);
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / (jobs.length || 1);
  return { segments, stats, avgWaiting, avgTurnaround };
}
