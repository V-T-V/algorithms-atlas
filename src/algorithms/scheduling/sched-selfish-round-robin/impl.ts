// 自私轮转调度 · 实现

export interface SrrJob {
  id: string;
  arrival: number;
  burst: number;
}

export interface SrrSegment {
  id: string;
  start: number;
  finish: number;
}

export interface SrrResult {
  segments: SrrSegment[];
  stats: Array<{ id: string; finish: number; waiting: number; turnaround: number }>;
  avgWaiting: number;
  avgTurnaround: number;
}

export interface SrrHooks {
  onAdmit?: (id: string) => void;
  onDispatch?: (id: string, poolSize: number) => void;
}

/**
 * 自私 RR：维护 active pool 和 waiting 队列。
 * 池大小达到 capacity 时不接纳新进程；池空或未满且有空闲才接纳。
 */
export function selfishRoundRobin(
  jobs: SrrJob[],
  quantum: number,
  capacity: number,
  hooks: SrrHooks = {},
): SrrResult {
  const remaining = new Map<string, number>();
  const jobMap = new Map<string, SrrJob>();
  for (const j of jobs) {
    remaining.set(j.id, j.burst);
    jobMap.set(j.id, j);
  }
  const arrivalOrder = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let arrivalIdx = 0;
  const pool: SrrJob[] = [];
  const waiting: SrrJob[] = [];
  let now = 0;
  const segments: SrrSegment[] = [];
  const finishTime = new Map<string, number>();
  const done = new Set<string>();

  const admitNew = (t: number): void => {
    while (arrivalIdx < arrivalOrder.length && arrivalOrder[arrivalIdx]!.arrival <= t) {
      waiting.push(arrivalOrder[arrivalIdx]!);
      arrivalIdx++;
    }
  };
  const tryAccept = (): void => {
    while (pool.length < capacity && waiting.length > 0) {
      const j = waiting.shift()!;
      pool.push(j);
      hooks.onAdmit?.(j.id);
    }
  };

  admitNew(now);
  tryAccept();
  while (done.size < jobs.length) {
    if (pool.length === 0) {
      if (waiting.length === 0 && arrivalIdx >= arrivalOrder.length) break;
      const nextArrival =
        arrivalIdx < arrivalOrder.length ? arrivalOrder[arrivalIdx]!.arrival : Infinity;
      if (nextArrival > now) now = nextArrival;
      admitNew(now);
      tryAccept();
      continue;
    }
    const job = pool.shift()!;
    hooks.onDispatch?.(job.id, pool.length + 1);
    const rem = remaining.get(job.id)!;
    const run = Math.min(quantum, rem);
    const start = now;
    const finish = start + run;
    segments.push({ id: job.id, start, finish });
    now = finish;
    admitNew(now);
    remaining.set(job.id, rem - run);
    if (remaining.get(job.id)! === 0) {
      done.add(job.id);
      finishTime.set(job.id, finish);
    } else {
      pool.push(job);
    }
    tryAccept();
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
