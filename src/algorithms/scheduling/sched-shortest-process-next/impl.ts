// 最短进程优先 · 实现

export interface SpnJob {
  id: string;
  arrival: number;
  burst: number;
}

export interface SpnStat {
  id: string;
  start: number;
  finish: number;
  waiting: number;
  turnaround: number;
}

export interface SpnResult {
  order: string[];
  stats: SpnStat[];
  avgWaiting: number;
  avgTurnaround: number;
}

export interface SpnHooks {
  onPick?: (id: string, burst: number, time: number) => void;
  onComplete?: (id: string, finish: number) => void;
}

/**
 * 非抢占式最短进程优先。
 * @param aging 启用 aging：等待越久给长进程减权越多，防饥饿。
 */
export function shortestProcessNext(
  jobs: SpnJob[],
  aging = false,
  hooks: SpnHooks = {},
): SpnResult {
  const n = jobs.length;
  if (n === 0) return { order: [], stats: [], avgWaiting: 0, avgTurnaround: 0 };
  const done = new Set<string>();
  const order: string[] = [];
  const stats: SpnStat[] = [];
  let now = Math.min(...jobs.map((j) => j.arrival));

  const eff = (j: SpnJob): number => {
    if (!aging) return j.burst;
    const wait = now - j.arrival;
    return Math.max(1, j.burst - Math.floor(wait / 4));
  };

  while (done.size < n) {
    const ready = jobs.filter((j) => !done.has(j.id) && j.arrival <= now);
    if (ready.length === 0) {
      const pending = jobs.filter((j) => !done.has(j.id));
      now = Math.min(...pending.map((j) => j.arrival));
      continue;
    }
    ready.sort((a, b) => eff(a) - eff(b) || a.id.localeCompare(b.id));
    const job = ready[0]!;
    const start = Math.max(now, job.arrival);
    const finish = start + job.burst;
    hooks.onPick?.(job.id, job.burst, start);
    order.push(job.id);
    stats.push({
      id: job.id,
      start,
      finish,
      waiting: start - job.arrival,
      turnaround: finish - job.arrival,
    });
    done.add(job.id);
    hooks.onComplete?.(job.id, finish);
    now = finish;
  }
  const avgWaiting = stats.reduce((s, x) => s + x.waiting, 0) / (n || 1);
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / (n || 1);
  return { order, stats, avgWaiting, avgTurnaround };
}
