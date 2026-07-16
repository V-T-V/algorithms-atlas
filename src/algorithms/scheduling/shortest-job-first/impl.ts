// =============================================================================
// 最短作业优先（Shortest Job First, SJF）· 纯算法实现
// 非抢占式调度：每次从已到达作业中选「执行时间最短」的先执行。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 选/调度/完成。
// =============================================================================

export interface Job {
  id: string;
  arrival: number;
  burst: number;
}

export interface ScheduledJob extends Job {
  /** 开始执行时刻。 */
  start: number;
  /** 完成时刻。 */
  finish: number;
  /** 等待时间 = start - arrival。 */
  waiting: number;
  /** 周转时间 = finish - arrival。 */
  turnaround: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SjfHooks {
  /** 候选作业集合中选择某作业（在已到达队列中选最短）。 */
  onPick?: (job: Job, readyQueue: Job[]) => void;
  /** 调度作业开始执行。 */
  onSchedule?: (job: Job, startTime: number) => void;
  /** 作业执行完成。 */
  onComplete?: (job: ScheduledJob) => void;
}

/**
 * 非抢占式最短作业优先（SJF）调度。
 * 平局规则：burst 相同时按到达时间更早者；仍相同时按 id 字典序。
 *
 * @param jobs 作业列表
 * @param hooks 可选事件钩子
 * @returns 按完成顺序排列的调度结果
 */
export function shortestJobFirst(jobs: readonly Job[], hooks: SjfHooks = {}): ScheduledJob[] {
  const remaining = jobs.map((j) => ({ ...j }));
  const scheduled: ScheduledJob[] = [];
  let now = 0;

  while (remaining.length > 0) {
    // 已到达的作业
    let ready = remaining.filter((j) => j.arrival <= now);
    // 若当前无作业到达：时间跳到下一个最早到达
    if (ready.length === 0) {
      const nextArrival = Math.min(...remaining.map((j) => j.arrival));
      now = nextArrival;
      ready = remaining.filter((j) => j.arrival <= now);
    }
    // 选最短作业（burst → arrival → id）
    ready.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival || a.id.localeCompare(b.id));
    const pick = ready[0]!;
    hooks.onPick?.(pick, ready);

    const start = Math.max(now, pick.arrival);
    const finish = start + pick.burst;
    hooks.onSchedule?.(pick, start);

    const result: ScheduledJob = {
      ...pick,
      start,
      finish,
      waiting: start - pick.arrival,
      turnaround: finish - pick.arrival,
    };
    scheduled.push(result);
    hooks.onComplete?.(result);

    now = finish;
    // 从剩余集合中移除
    const idx = remaining.findIndex((j) => j.id === pick.id);
    if (idx >= 0) remaining.splice(idx, 1);
  }

  return scheduled;
}
