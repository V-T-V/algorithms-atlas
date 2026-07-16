// =============================================================================
// 最早截止时间优先（EDF）· 纯算法实现
// 抢占式：每时间单位选最早截止期的就绪作业。零 DOM 依赖，可独立单测。
// =============================================================================

export interface EdfJob {
  id: string;
  arrival: number;
  /** 执行时间。 */
  execution: number;
  /** 绝对截止期（>= arrival）。 */
  deadline: number;
}

export interface EdfSegment {
  id: string;
  start: number;
  finish: number;
}

export interface EdfJobStat {
  id: string;
  arrival: number;
  execution: number;
  deadline: number;
  finish: number;
  /** 是否在截止期前完成。 */
  metDeadline: boolean;
}

export interface EdfResult {
  segments: EdfSegment[];
  stats: EdfJobStat[];
  /** 是否所有作业都满足截止期。 */
  allMet: boolean;
  /** 错过截止期的作业数。 */
  missedCount: number;
  /** 总模拟时长。 */
  makespan: number;
}

export interface EdfHooks {
  /** 每个时间单位选择某作业运行（含 null 表示空闲）。 */
  onSchedule?: (time: number, jobId: string | null) => void;
  /** 某作业完成。 */
  onComplete?: (job: EdfJob, finish: number, met: boolean) => void;
  /** 检测到错过截止期。 */
  onDeadlineMiss?: (job: EdfJob, time: number) => void;
}

/**
 * 最早截止时间优先（EDF，抢占式）。
 *
 * @param jobs 作业列表
 * @param hooks 可选钩子
 * @param horizon 仿真上界（默认推到所有作业完成或不可调度）
 */
export function earliestDeadlineFirst(
  jobs: readonly EdfJob[],
  hooks: EdfHooks = {},
  horizon?: number,
): EdfResult {
  const n = jobs.length;
  if (n === 0) return { segments: [], stats: [], allMet: true, missedCount: 0, makespan: 0 };

  const remaining = new Map<string, number>();
  for (const j of jobs) remaining.set(j.id, j.execution);
  const finishTime = new Map<string, number>();
  const missed = new Set<string>();

  const maxDeadline = Math.max(...jobs.map((j) => Math.max(j.deadline, j.arrival + j.execution)));
  const cap = horizon ?? maxDeadline * 2 + 10;

  let now = 0;
  const segments: EdfSegment[] = [];

  const isReady = (j: EdfJob, t: number): boolean =>
    j.arrival <= t && (remaining.get(j.id) ?? 0) > 0;
  const pickEarliest = (t: number): EdfJob | null => {
    let best: EdfJob | null = null;
    for (const j of jobs) {
      if (!isReady(j, t)) continue;
      if (best === null || j.deadline < best.deadline) best = j;
    }
    return best;
  };

  while (now < cap) {
    // 检测此刻是否有作业错过截止期（仍就绪且 deadline < now）
    for (const j of jobs) {
      if (isReady(j, now) && j.deadline < now && !missed.has(j.id)) {
        missed.add(j.id);
        hooks.onDeadlineMiss?.(j, now);
      }
    }
    // 全完成？
    if ([...remaining.values()].every((r) => r === 0)) break;

    const job = pickEarliest(now);
    if (!job) {
      hooks.onSchedule?.(now, null);
      now++;
      continue;
    }
    hooks.onSchedule?.(now, job.id);
    // 运行 1 个时间单位
    const start = now;
    const finish = now + 1;
    remaining.set(job.id, (remaining.get(job.id) ?? 0) - 1);
    // 合并连续同作业段
    const lastSeg = segments[segments.length - 1];
    if (lastSeg && lastSeg.id === job.id && lastSeg.finish === start) {
      lastSeg.finish = finish;
    } else {
      segments.push({ id: job.id, start, finish });
    }
    if ((remaining.get(job.id) ?? 0) === 0 && !finishTime.has(job.id)) {
      finishTime.set(job.id, finish);
      const met = finish <= job.deadline;
      if (!met && !missed.has(job.id)) missed.add(job.id);
      hooks.onComplete?.(job, finish, met);
    }
    now = finish;
  }

  const stats: EdfJobStat[] = jobs.map((j) => {
    const finish = finishTime.get(j.id) ?? -1;
    const met = finish >= 0 && finish <= j.deadline;
    return {
      id: j.id,
      arrival: j.arrival,
      execution: j.execution,
      deadline: j.deadline,
      finish,
      metDeadline: met,
    };
  });
  const missedCount = stats.filter((s) => !s.metDeadline).length;

  return {
    segments,
    stats,
    allMet: missedCount === 0,
    missedCount,
    makespan: now,
  };
}
