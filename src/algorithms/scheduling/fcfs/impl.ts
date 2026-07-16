// =============================================================================
// 先来先服务（First-Come First-Served, FCFS）· 纯算法实现
// 非抢占式调度：按到达时间排序后顺序执行。
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
}

export interface FcfsResult {
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
export interface FcfsHooks {
  /** 调度某进程开始执行（startTime 为实际开始时刻）。 */
  onDispatch?: (job: Job, startTime: number) => void;
  /** 某进程执行完成。 */
  onComplete?: (job: ScheduledJob) => void;
}

/**
 * 先来先服务（FCFS）非抢占式调度。
 *
 * 规则：
 *  - 按到达时间排序（平局按 id 字典序）
 *  - 顺序执行；若当前 CPU 空闲且下一个进程尚未到达，时间跳到其到达时刻
 *  - start = max(前一个完成时刻, arrival)
 *
 * 时间复杂度：O(n log n)（排序），空间 O(n)。
 *
 * @param jobs 进程列表
 * @param hooks 可选事件钩子
 * @returns 调度结果
 */
export function fcfs(jobs: readonly Job[], hooks: FcfsHooks = {}): FcfsResult {
  const n = jobs.length;
  if (n === 0) {
    return { stats: [], segments: [], avgWait: 0, avgTurnaround: 0 };
  }

  // 按到达时间排序（平局按 id）
  const order = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));

  const stats: ScheduledJob[] = [];
  const segments: Array<{ id: string; start: number; finish: number }> = [];
  let now = 0;

  for (const j of order) {
    const start = Math.max(now, j.arrival);
    const completion = start + j.burst;
    const wait = start - j.arrival;
    const turnaround = completion - j.arrival;
    const sj: ScheduledJob = {
      ...j,
      start,
      completion,
      wait,
      turnaround,
    };
    hooks.onDispatch?.(j, start);
    stats.push(sj);
    segments.push({ id: j.id, start, finish: completion });
    now = completion;
    hooks.onComplete?.(sj);
  }

  const avgWait = stats.reduce((s, x) => s + x.wait, 0) / n;
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / n;

  return { stats, segments, avgWait, avgTurnaround };
}
