// =============================================================================
// 高响应比优先（Highest Response Ratio Next, HRRN）· 纯算法实现
// 非抢占式调度：每次从已到达作业中选「响应比 = (wait + burst) / burst」最高者。
// 既照顾短作业（响应比高），又防止长作业饥饿（等待越久响应比越高）。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 选/调度/完成。
// =============================================================================

export interface Job {
  id: string;
  /** 到达时间。 */
  arrival: number;
  /** 执行时间（CPU 突发）。 */
  burst: number;
}

export interface ScheduledJob extends Job {
  /** 开始执行时刻。 */
  start: number;
  /** 完成时刻。 */
  completion: number;
  /** 等待时间 = start - arrival。 */
  wait: number;
  /** 周转时间 = completion - arrival。 */
  turnaround: number;
  /** 被选中时的响应比。 */
  responseRatio: number;
}

export interface HrrnResult {
  /** 每个进程的统计（按完成顺序）。 */
  stats: ScheduledJob[];
  /** 执行时间段序列（甘特图段）。 */
  segments: Array<{ id: string; start: number; finish: number }>;
  /** 平均等待时间。 */
  avgWait: number;
  /** 平均周转时间。 */
  avgTurnaround: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface HrrnHooks {
  /** 计算并选择响应比最高的作业（给出所有候选及其响应比）。 */
  onPick?: (job: Job, ratio: number, candidates: Array<{ job: Job; ratio: number }>) => void;
  /** 调度作业开始执行。 */
  onSchedule?: (job: Job, startTime: number) => void;
  /** 作业执行完成。 */
  onComplete?: (job: ScheduledJob) => void;
}

/**
 * 计算响应比 RR = (wait + burst) / burst = 1 + wait/burst。
 */
export function responseRatio(wait: number, burst: number): number {
  return (wait + burst) / burst;
}

/**
 * 高响应比优先（HRRN）非抢占式调度。
 *
 * 规则：
 *  - 非抢占；当前作业完成后才决策下一个
 *  - 候选 = 已到达且未完成的作业
 *  - 每个候选的响应比 RR = (wait + burst) / burst，wait = now - arrival
 *  - 选 RR 最高者（平局按 arrival，再按 id 字典序）
 *
 * 时间复杂度：O(n²)（每轮扫描候选），空间 O(n)。
 *
 * @param jobs 作业列表
 * @param hooks 可选事件钩子
 * @returns 调度结果
 */
export function hrrn(jobs: readonly Job[], hooks: HrrnHooks = {}): HrrnResult {
  const n = jobs.length;
  if (n === 0) {
    return { stats: [], segments: [], avgWait: 0, avgTurnaround: 0 };
  }

  const remaining = jobs.map((j) => ({ ...j }));
  const stats: ScheduledJob[] = [];
  const segments: Array<{ id: string; start: number; finish: number }> = [];
  let now = 0;

  while (remaining.length > 0) {
    // 已到达的候选
    let ready = remaining.filter((j) => j.arrival <= now);
    // 无候选：快进到下一个最早到达
    if (ready.length === 0) {
      now = Math.min(...remaining.map((j) => j.arrival));
      ready = remaining.filter((j) => j.arrival <= now);
    }

    // 计算响应比
    const candidates = ready.map((j) => ({
      job: j,
      ratio: responseRatio(now - j.arrival, j.burst),
    }));
    // 选 RR 最高（平局 arrival，再 id）
    candidates.sort(
      (a, b) =>
        b.ratio - a.ratio || a.job.arrival - b.job.arrival || a.job.id.localeCompare(b.job.id),
    );
    const pick = candidates[0]!;
    hooks.onPick?.(pick.job, pick.ratio, candidates);

    const start = Math.max(now, pick.job.arrival);
    const completion = start + pick.job.burst;
    const wait = start - pick.job.arrival;
    const turnaround = completion - pick.job.arrival;
    const sj: ScheduledJob = {
      ...pick.job,
      start,
      completion,
      wait,
      turnaround,
      responseRatio: pick.ratio,
    };
    hooks.onSchedule?.(pick.job, start);
    stats.push(sj);
    segments.push({ id: pick.job.id, start, finish: completion });
    now = completion;
    hooks.onComplete?.(sj);

    // 从 remaining 移除
    const idx = remaining.findIndex((j) => j.id === pick.job.id);
    remaining.splice(idx, 1);
  }

  const avgWait = stats.reduce((s, x) => s + x.wait, 0) / n;
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / n;

  return { stats, segments, avgWait, avgTurnaround };
}
