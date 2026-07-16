// =============================================================================
// 优先级调度（Priority Scheduling）· 纯算法实现
// 支持非抢占式与抢占式两种模式。零 DOM 依赖，可独立单测。
// 通过「钩子」暴露 选/调度/抢占/完成。
// =============================================================================

export interface PriorityJob {
  id: string;
  arrival: number;
  burst: number;
  /** 优先级：数值越小优先级越高（约定）。 */
  priority: number;
}

export interface ScheduledSegment {
  /** 进程 id。 */
  id: string;
  /** 本段开始时刻。 */
  start: number;
  /** 本段结束时刻。 */
  finish: number;
}

export interface PriorityScheduleResult {
  /** 扌执行的时间段序列（甘特图段）。 */
  segments: ScheduledSegment[];
  /** 每个进程的统计。 */
  stats: Array<{
    id: string;
    arrival: number;
    burst: number;
    priority: number;
    /** 首次开始时刻。 */
    start: number;
    /** 完成时刻。 */
    finish: number;
    /** 等待时间 = finish - arrival - burst。 */
    waiting: number;
    /** 周转时间 = finish - arrival。 */
    turnaround: number;
  }>;
  /** 平均等待时间。 */
  avgWaiting: number;
  /** 平均周转时间。 */
  avgTurnaround: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PrioritySchedulingHooks {
  /** 从就绪队列中选出某进程（priority 最小者）。 */
  onPick?: (job: PriorityJob, readyQueue: PriorityJob[]) => void;
  /** 某进程开始/继续执行一段。 */
  onSchedule?: (job: PriorityJob, start: number, finish: number) => void;
  /** 抢占：当前运行的进程被更高优先级者打断。 */
  onPreempt?: (current: PriorityJob, by: PriorityJob, at: number) => void;
  /** 某进程执行完成。 */
  onComplete?: (job: PriorityJob, finish: number) => void;
}

export interface PrioritySchedulingOptions {
  /** 是否抢占式。默认 false（非抢占）。 */
  preemptive?: boolean;
}

/**
 * 优先级调度。priority 数值越小优先级越高。
 * 平局规则：priority 相同时按到达时间更早者；仍相同时按 id 字典序。
 *
 * @param jobs 进程列表
 * @param options 选项（preemptive）
 * @param hooks 可选事件钩子
 * @returns 调度结果（时间段 + 统计）
 */
export function priorityScheduling(
  jobs: readonly PriorityJob[],
  options: PrioritySchedulingOptions = {},
  hooks: PrioritySchedulingHooks = {},
): PriorityScheduleResult {
  const { preemptive = false } = options;

  // 每个进程的剩余时间
  const remaining = new Map<string, number>();
  const jobMap = new Map<string, PriorityJob>();
  for (const j of jobs) {
    remaining.set(j.id, j.burst);
    jobMap.set(j.id, j);
  }

  const segments: ScheduledSegment[] = [];
  // 首次开始时刻记录
  const firstStart = new Map<string, number>();
  const finishTime = new Map<string, number>();

  /** 比较函数：选优先级最高（priority 最小）的就绪进程。 */
  const pickBest = (ready: PriorityJob[]): PriorityJob => {
    return [...ready].sort(
      (a, b) => a.priority - b.priority || a.arrival - b.arrival || a.id.localeCompare(b.id),
    )[0]!;
  };

  let now = 0;
  let current: PriorityJob | null = null;
  let segStart = 0;
  const done = new Set<string>();
  const n = jobs.length;

  if (n === 0) {
    return { segments: [], stats: [], avgWaiting: 0, avgTurnaround: 0 };
  }

  while (done.size < n) {
    // 就绪集：已到达且未完成
    const ready = jobs.filter((j) => j.arrival <= now && !done.has(j.id));
    if (ready.length === 0) {
      // 无就绪：快进到下一个到达
      const upcoming = jobs.filter((j) => !done.has(j.id) && j.arrival > now);
      if (upcoming.length === 0) break;
      now = Math.min(...upcoming.map((j) => j.arrival));
      continue;
    }

    const best = pickBest(ready);

    if (current && current.id !== best.id) {
      // 发生切换（抢占或自然切换）
      if (preemptive && remaining.get(current.id)! > 0) {
        hooks.onPreempt?.(current, best, now);
      }
      // 结束当前段
      if (segStart < now) {
        segments.push({ id: current.id, start: segStart, finish: now });
        hooks.onSchedule?.(current, segStart, now);
      }
      current = null;
    }
    if (!current) {
      current = best;
      segStart = now;
      if (!firstStart.has(best.id)) firstStart.set(best.id, now);
      hooks.onPick?.(best, ready);
    }

    if (preemptive) {
      // 运行到下一个进程到达或本进程完成（取较早者）
      const nextArrivals = jobs.filter(
        (j) => j.arrival > now && !done.has(j.id) && j.id !== current!.id,
      );
      const nextArrival =
        nextArrivals.length > 0 ? Math.min(...nextArrivals.map((j) => j.arrival)) : Infinity;
      const remain = remaining.get(current.id)!;
      const runEnd = Math.min(now + remain, nextArrival);
      remaining.set(current.id, remain - (runEnd - now));

      if (remaining.get(current.id)! === 0) {
        // 完成
        if (segStart < runEnd) {
          segments.push({ id: current.id, start: segStart, finish: runEnd });
          hooks.onSchedule?.(current, segStart, runEnd);
        }
        finishTime.set(current.id, runEnd);
        done.add(current.id);
        hooks.onComplete?.(current, runEnd);
        current = null;
      }
      now = runEnd;
    } else {
      // 非抢占：直接运行到完成
      const start = now;
      const finish = now + remaining.get(best.id)!;
      segments.push({ id: best.id, start, finish });
      hooks.onSchedule?.(best, start, finish);
      remaining.set(best.id, 0);
      finishTime.set(best.id, finish);
      done.add(best.id);
      hooks.onComplete?.(best, finish);
      now = finish;
      current = null;
    }
  }
  // 收尾：若仍有未提交的段
  if (current && segStart < now) {
    segments.push({ id: current.id, start: segStart, finish: now });
    hooks.onSchedule?.(current, segStart, now);
  }

  // 统计
  const stats = jobs.map((j) => {
    const finish = finishTime.get(j.id)!;
    const start = firstStart.get(j.id)!;
    const turnaround = finish - j.arrival;
    const waiting = turnaround - j.burst;
    return {
      id: j.id,
      arrival: j.arrival,
      burst: j.burst,
      priority: j.priority,
      start,
      finish,
      waiting,
      turnaround,
    };
  });
  const avgWaiting = stats.reduce((s, x) => s + x.waiting, 0) / (n || 1);
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / (n || 1);

  return { segments, stats, avgWaiting, avgTurnaround };
}
