// 抢占式最高响应比优先 · 实现

export interface Job {
  id: string;
  arrival: number;
  burst: number;
}

export interface Segment {
  id: string;
  start: number;
  finish: number;
}

export interface Result {
  segments: Segment[];
  stats: Array<{ id: string; finish: number; waiting: number; turnaround: number }>;
  avgWaiting: number;
  avgTurnaround: number;
}

export interface Hooks {
  onPick?: (id: string, ratio: number, time: number) => void;
  onPreempt?: (fromId: string, toId: string, time: number) => void;
  onComplete?: (id: string, finish: number) => void;
}

/** 抢占式 HRRN：以 1 为单位推进，每当新进程到达时重算响应比。 */
export function preemptiveHrrn(jobs: Job[], hooks: Hooks = {}): Result {
  const remaining = new Map<string, number>();
  const jobMap = new Map<string, Job>();
  for (const j of jobs) {
    remaining.set(j.id, j.burst);
    jobMap.set(j.id, j);
  }
  const arrivalOrder = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let arrivalIdx = 0;
  const finishTime = new Map<string, number>();
  const done = new Set<string>();
  const segments: Segment[] = [];
  let now = 0;
  let running: string | null = null;
  let segStart = 0;
  const firstArrival = arrivalOrder[0]?.arrival ?? 0;
  if (now < firstArrival) now = firstArrival;

  const ratioOf = (id: string, t: number): number => {
    const rem = remaining.get(id)!;
    const wait = t - jobMap.get(id)!.arrival - (jobMap.get(id)!.burst - rem);
    return (wait + rem) / rem;
  };

  while (done.size < jobs.length) {
    // 推进到达
    while (arrivalIdx < arrivalOrder.length && arrivalOrder[arrivalIdx]!.arrival <= now) {
      arrivalIdx++;
    }
    // 候选 = 已到达未完成
    const candidates = arrivalOrder
      .slice(0, arrivalIdx)
      .filter((j) => !done.has(j.id) && remaining.get(j.id)! > 0);
    if (candidates.length === 0) {
      if (arrivalIdx >= arrivalOrder.length) break;
      // 快进到下一个到达
      if (running !== null) {
        segments.push({ id: running, start: segStart, finish: now });
        running = null;
      }
      now = arrivalOrder[arrivalIdx]!.arrival;
      continue;
    }
    // 选响应比最高
    let best = candidates[0]!;
    let bestR = ratioOf(best.id, now);
    for (const c of candidates) {
      const r = ratioOf(c.id, now);
      if (r > bestR || (r === bestR && c.id < best.id)) {
        best = c;
        bestR = r;
      }
    }
    if (running !== null && running !== best.id) {
      hooks.onPreempt?.(running, best.id, now);
      segments.push({ id: running, start: segStart, finish: now });
      running = best.id;
      segStart = now;
      hooks.onPick?.(best.id, bestR, now);
    } else if (running === null) {
      running = best.id;
      segStart = now;
      hooks.onPick?.(best.id, bestR, now);
    }
    // 运行 1 个时间单位，或到下一个到达事件
    const nextArrival =
      arrivalIdx < arrivalOrder.length ? arrivalOrder[arrivalIdx]!.arrival : Infinity;
    const runLen = Math.min(remaining.get(running)!, nextArrival - now);
    remaining.set(running, remaining.get(running)! - runLen);
    now += runLen;
    if (remaining.get(running)! === 0) {
      segments.push({ id: running, start: segStart, finish: now });
      done.add(running);
      finishTime.set(running, now);
      hooks.onComplete?.(running, now);
      running = null;
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
