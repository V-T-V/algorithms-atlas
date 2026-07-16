// 多级反馈队列 · 实现

export interface MlfqJob {
  id: string;
  arrival: number;
  burst: number;
}

export interface MlfqSegment {
  id: string;
  start: number;
  finish: number;
  level: number;
}

export interface MlfqResult {
  segments: MlfqSegment[];
  stats: Array<{
    id: string;
    finish: number;
    waiting: number;
    turnaround: number;
    finalLevel: number;
  }>;
  avgWaiting: number;
  avgTurnaround: number;
}

export interface MlfqHooks {
  onDispatch?: (id: string, level: number, quantum: number) => void;
  onDemote?: (id: string, fromLevel: number, toLevel: number) => void;
  onComplete?: (id: string, finish: number) => void;
  onBoost?: () => void;
}

/**
 * 多级反馈队列。
 * @param levels 队列层数（默认 3）
 * @param baseQuantum 最高层时间片，下层 = base * 2^level
 * @param boostInterval 每 boostInterval 单位触发一次优先级提升（所有进程回到最高层）
 */
export function multilevelFeedbackQueue(
  jobs: MlfqJob[],
  levels = 3,
  baseQuantum = 2,
  boostInterval = 20,
  hooks: MlfqHooks = {},
): MlfqResult {
  const quantumOf = (lvl: number): number => baseQuantum * (1 << lvl);
  const remaining = new Map<string, number>();
  const jobMap = new Map<string, MlfqJob>();
  const levelOf = new Map<string, number>();
  for (const j of jobs) {
    remaining.set(j.id, j.burst);
    jobMap.set(j.id, j);
    levelOf.set(j.id, 0);
  }

  const arrivalOrder = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let arrivalIdx = 0;
  const queues: MlfqJob[][] = Array.from({ length: levels }, () => []);
  let now = 0;
  let lastBoost = 0;
  const segments: MlfqSegment[] = [];
  const finishTime = new Map<string, number>();
  const done = new Set<string>();
  const usedInSlice = new Map<string, number>();

  const admit = (t: number): void => {
    while (arrivalIdx < arrivalOrder.length && arrivalOrder[arrivalIdx]!.arrival <= t) {
      const j = arrivalOrder[arrivalIdx]!;
      queues[0]!.push(j);
      levelOf.set(j.id, 0);
      usedInSlice.set(j.id, 0);
      arrivalIdx++;
    }
  };
  const boost = (): void => {
    if (now - lastBoost >= boostInterval) {
      for (let lvl = 1; lvl < levels; lvl++) {
        for (const j of queues[lvl]!) {
          queues[0]!.push(j);
          levelOf.set(j.id, 0);
          usedInSlice.set(j.id, 0);
        }
        queues[lvl] = [];
      }
      lastBoost = now;
      hooks.onBoost?.();
    }
  };
  const pickTop = (): { job: MlfqJob; level: number } | null => {
    for (let lvl = 0; lvl < levels; lvl++) {
      if (queues[lvl]!.length > 0) {
        const job = queues[lvl]!.shift()!;
        return { job, level: lvl };
      }
    }
    return null;
  };

  admit(now);
  while (done.size < jobs.length) {
    boost();
    const top = pickTop();
    if (top === null) {
      const nextArrival =
        arrivalIdx < arrivalOrder.length ? arrivalOrder[arrivalIdx]!.arrival : Infinity;
      if (nextArrival === Infinity) break;
      now = nextArrival;
      admit(now);
      continue;
    }
    const { job, level } = top;
    const q = quantumOf(level);
    const rem = remaining.get(job.id)!;
    const run = Math.min(q, rem);
    const start = now;
    const finish = start + run;
    segments.push({ id: job.id, start, finish, level });
    hooks.onDispatch?.(job.id, level, q);
    remaining.set(job.id, rem - run);
    now = finish;
    admit(now);
    if (remaining.get(job.id)! === 0) {
      done.add(job.id);
      finishTime.set(job.id, finish);
      hooks.onComplete?.(job.id, finish);
    } else {
      // 降级
      const nextLevel = Math.min(levels - 1, level + 1);
      if (nextLevel !== level) hooks.onDemote?.(job.id, level, nextLevel);
      queues[nextLevel]!.push(job);
      levelOf.set(job.id, nextLevel);
    }
  }

  const stats = jobs.map((j) => {
    const finish = finishTime.get(j.id) ?? 0;
    const turnaround = finish - j.arrival;
    return {
      id: j.id,
      finish,
      waiting: turnaround - j.burst,
      turnaround,
      finalLevel: levelOf.get(j.id) ?? 0,
    };
  });
  const avgWaiting = stats.reduce((s, x) => s + x.waiting, 0) / (jobs.length || 1);
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / (jobs.length || 1);
  return { segments, stats, avgWaiting, avgTurnaround };
}
