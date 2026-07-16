// 最短处理时间优先（非抢占 SPT）· 纯算法实现

export interface SptJob {
  id: string;
  arrival: number;
  burst: number;
}

export interface SptScheduled extends SptJob {
  start: number;
  completion: number;
  wait: number;
  turnaround: number;
}

export interface SptResult {
  stats: SptScheduled[];
  segments: Array<{ id: string; start: number; finish: number }>;
  avgWait: number;
  avgTurnaround: number;
}

/** 事件钩子。 */
export interface SptHooks {
  /** 选定某作业开始（给出当前时刻与就绪队列大小）。 */
  onDispatch?: (job: SptJob, time: number, readySize: number) => void;
  /** 某作业完成。 */
  onComplete?: (stat: SptScheduled) => void;
}

/**
 * 非抢占式 SPT。
 *
 * @param jobs 作业列表
 * @param hooks 可选事件钩子
 */
export function shortestProcessingTime(jobs: readonly SptJob[], hooks: SptHooks = {}): SptResult {
  const n = jobs.length;
  if (n === 0) return { stats: [], segments: [], avgWait: 0, avgTurnaround: 0 };

  const remaining = jobs.map((j) => ({ ...j }));
  const done = new Set<string>();
  const stats: SptScheduled[] = [];
  const segments: Array<{ id: string; start: number; finish: number }> = [];
  let now = 0;

  while (done.size < n) {
    // 已到达未完成
    const ready = remaining.filter((j) => !done.has(j.id) && j.arrival <= now);
    if (ready.length === 0) {
      // CPU 空闲，跳到下一个最早到达
      const pending = remaining.filter((j) => !done.has(j.id));
      if (pending.length === 0) break;
      const nextArrival = Math.min(...pending.map((j) => j.arrival));
      now = nextArrival;
      continue;
    }
    // 选 burst 最短，平局 arrival，再 id
    ready.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival || a.id.localeCompare(b.id));
    const pick = ready[0]!;
    const readySize = ready.length;
    hooks.onDispatch?.(pick, now, readySize);
    const start = now;
    const completion = start + pick.burst;
    const wait = start - pick.arrival;
    const turnaround = completion - pick.arrival;
    const stat: SptScheduled = {
      ...pick,
      start,
      completion,
      wait,
      turnaround,
    };
    stats.push(stat);
    segments.push({ id: pick.id, start, finish: completion });
    done.add(pick.id);
    now = completion;
    hooks.onComplete?.(stat);
  }

  const avgWait = stats.reduce((s, x) => s + x.wait, 0) / n;
  const avgTurn = stats.reduce((s, x) => s + x.turnaround, 0) / n;
  return { stats, segments, avgWait, avgTurnaround: avgTurn };
}
