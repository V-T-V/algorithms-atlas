// =============================================================================
// 最短剩余时间优先（Shortest Remaining Time First, SRTF）· 纯算法实现
// SJF 的抢占式版本：每个时间单位选「剩余 burst 最短」的进程运行；
// 当新进程到达且剩余时间更短时，抢占当前运行进程。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 选/运行/完成。
// =============================================================================

export interface Job {
  id: string;
  /** 到达时间。 */
  arrival: number;
  /** 执行时间（CPU 突发）。 */
  burst: number;
}

export interface ScheduledJob extends Job {
  /** 完成时刻。 */
  completion: number;
  /** 等待时间 = completion - arrival - burst。 */
  wait: number;
  /** 周转时间 = completion - arrival。 */
  turnaround: number;
}

export interface SrtfResult {
  /** 执行时间段序列（甘特图段，已合并相邻同 id 段）。 */
  segments: Array<{ id: string; start: number; finish: number }>;
  /** 每个进程的统计。 */
  stats: ScheduledJob[];
  /** 平均等待时间。 */
  avgWait: number;
  /** 平均周转时间。 */
  avgTurnaround: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SrtfHooks {
  /** 选出某进程执行（每选一次触发一次）。 */
  onPick?: (job: Job, remaining: number, time: number) => void;
  /** 某进程执行完成。 */
  onComplete?: (job: ScheduledJob) => void;
}

/**
 * 最短剩余时间优先（SRTF）抢占式调度。
 *
 * 规则：
 *  - 在每个决策点（当前段结束 / 新进程到达），从「已到达且未完成」的进程中
 *    选剩余 burst 最短者运行（平局按 arrival，再按 id 字典序）。
 *  - 进程运行到下一个决策点：要么完成，要么有新进程到达需要重新决策。
 *  - 相邻同进程的运行段会被合并。
 *
 * 时间复杂度：O(n·T)，T 为总完成时间（最坏指数级于输入规模）。
 * 空间 O(n)。
 *
 * @param jobs 进程列表
 * @param hooks 可选事件钩子
 * @returns 调度结果
 */
export function srtf(jobs: readonly Job[], hooks: SrtfHooks = {}): SrtfResult {
  const n = jobs.length;
  if (n === 0) {
    return { segments: [], stats: [], avgWait: 0, avgTurnaround: 0 };
  }

  const remaining = new Map<string, number>();
  const jobMap = new Map<string, Job>();
  for (const j of jobs) {
    remaining.set(j.id, j.burst);
    jobMap.set(j.id, j);
  }

  const completion = new Map<string, number>();
  const rawSegments: Array<{ id: string; start: number; finish: number }> = [];

  // 所有需要决策的时间点：到达时刻 +（隐式的完成时刻）
  const arrivals = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let now = 0;
  let doneCount = 0;
  const totalBurst = jobs.reduce((s, j) => s + j.burst, 0);

  while (doneCount < n) {
    // 已到达且未完成的进程
    const ready = [...remaining.entries()]
      .filter(([id, rem]) => rem > 0 && jobMap.get(id)!.arrival <= now)
      .map(([id, rem]) => ({ job: jobMap.get(id)!, rem }));

    if (ready.length === 0) {
      // CPU 空闲：快进到下一个未处理进程的到达时刻
      const nextArrival = Math.min(
        ...[...remaining.entries()]
          .filter(([, rem]) => rem > 0)
          .map(([id]) => jobMap.get(id)!.arrival)
          .filter((a) => a > now),
      );
      now = nextArrival;
      continue;
    }

    // 选剩余最短（平局 arrival，再 id）
    ready.sort(
      (a, b) => a.rem - b.rem || a.job.arrival - b.job.arrival || a.job.id.localeCompare(b.job.id),
    );
    const pick = ready[0]!;
    hooks.onPick?.(pick.job, pick.rem, now);

    // 下一个决策点：下一个比 now 晚的到达时刻
    const futureArrivals = arrivals
      .filter((j) => j.arrival > now && remaining.get(j.id)! > 0)
      .map((j) => j.arrival);
    const nextArrival = futureArrivals.length > 0 ? Math.min(...futureArrivals) : Infinity;

    // 本段运行长度
    const run = Math.min(pick.rem, nextArrival - now);
    const segStart = now;
    const segFinish = now + run;
    rawSegments.push({ id: pick.job.id, start: segStart, finish: segFinish });

    const newRem = pick.rem - run;
    remaining.set(pick.job.id, newRem);
    now = segFinish;

    if (newRem === 0) {
      completion.set(pick.job.id, now);
      const sj: ScheduledJob = {
        ...pick.job,
        completion: now,
        wait: now - pick.job.arrival - pick.job.burst,
        turnaround: now - pick.job.arrival,
      };
      doneCount++;
      hooks.onComplete?.(sj);
    }
  }

  // 合并相邻同 id 段
  const segments: Array<{ id: string; start: number; finish: number }> = [];
  for (const seg of rawSegments) {
    const last = segments[segments.length - 1];
    if (last && last.id === seg.id && last.finish === seg.start) {
      last.finish = seg.finish;
    } else {
      segments.push({ ...seg });
    }
  }

  const stats: ScheduledJob[] = jobs.map((j) => {
    const comp = completion.get(j.id)!;
    return {
      ...j,
      completion: comp,
      wait: comp - j.arrival - j.burst,
      turnaround: comp - j.arrival,
    };
  });
  const avgWait = stats.reduce((s, x) => s + x.wait, 0) / n;
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / n;

  void totalBurst;

  return { segments, stats, avgWait, avgTurnaround };
}
