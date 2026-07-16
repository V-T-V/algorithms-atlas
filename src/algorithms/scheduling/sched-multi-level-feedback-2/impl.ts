// 自适应反馈调度 · 实现

export interface AfJob {
  id: string;
  arrival: number;
  burst: number;
}

export interface AfSegment {
  id: string;
  start: number;
  finish: number;
  quantum: number;
}

export interface AfStat {
  id: string;
  finish: number;
  waiting: number;
  turnaround: number;
  finalQuantum: number;
}

export interface AfResult {
  segments: AfSegment[];
  stats: AfStat[];
  avgWaiting: number;
  avgTurnaround: number;
}

export interface AfHooks {
  onDispatch?: (id: string, quantum: number) => void;
  onTune?: (id: string, oldQ: number, newQ: number) => void;
  onComplete?: (id: string, finish: number) => void;
}

/**
 * 自适应反馈：quantum 随进程 usage ratio 调整。
 * usage = used/quantum；EMA 平滑。CPU 密集（usage→1）则增大 quantum，交互（usage 小）则减小。
 */
export function adaptiveFeedback(jobs: AfJob[], baseQuantum = 2, hooks: AfHooks = {}): AfResult {
  const remaining = new Map<string, number>();
  const quantum = new Map<string, number>();
  const usageEma = new Map<string, number>();
  const jobMap = new Map<string, AfJob>();
  for (const j of jobs) {
    remaining.set(j.id, j.burst);
    quantum.set(j.id, baseQuantum);
    usageEma.set(j.id, 1);
    jobMap.set(j.id, j);
  }
  const arrivalOrder = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let arrivalIdx = 0;
  let now = arrivalOrder[0]?.arrival ?? 0;
  const segments: AfSegment[] = [];
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
    // 选 quantum 最小者（交互优先）；平手按 id
    ready.sort((a, b) => quantum.get(a.id)! - quantum.get(b.id)! || a.id.localeCompare(b.id));
    const job = ready[0]!;
    const q = quantum.get(job.id)!;
    const rem = remaining.get(job.id)!;
    const run = Math.min(q, rem);
    const start = now;
    const finish = start + run;
    hooks.onDispatch?.(job.id, q);
    segments.push({ id: job.id, start, finish, quantum: q });
    remaining.set(job.id, rem - run);
    now = finish;
    // 更新 usage EMA（usage = run/q）
    const usage = run / q;
    const ema = 0.5 * usageEma.get(job.id)! + 0.5 * usage;
    usageEma.set(job.id, ema);
    // 调整 quantum：CPU 密集（ema 高）增大，交互（ema 低）减小
    const oldQ = q;
    let newQ: number;
    if (ema > 0.8) newQ = Math.min(q + 1, baseQuantum * 4);
    else if (ema < 0.4) newQ = Math.max(1, q - 1);
    else newQ = q;
    if (newQ !== oldQ) hooks.onTune?.(job.id, oldQ, newQ);
    quantum.set(job.id, newQ);
    if (remaining.get(job.id)! === 0) {
      done.add(job.id);
      finishTime.set(job.id, finish);
      hooks.onComplete?.(job.id, finish);
    }
  }

  const stats: AfStat[] = jobs.map((j) => {
    const finish = finishTime.get(j.id) ?? 0;
    const turnaround = finish - j.arrival;
    return {
      id: j.id,
      finish,
      waiting: turnaround - j.burst,
      turnaround,
      finalQuantum: quantum.get(j.id) ?? baseQuantum,
    };
  });
  const avgWaiting = stats.reduce((s, x) => s + x.waiting, 0) / (jobs.length || 1);
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / (jobs.length || 1);
  return { segments, stats, avgWaiting, avgTurnaround };
}
