// =============================================================================
// 轮转调度（Round Robin）· 纯算法实现
// 时间片轮转：每个就绪进程轮流执行一个时间片 quantum，未完成则排到队尾。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 选/运行/入队/完成。
// =============================================================================

export interface Job {
  id: string;
  arrival: number;
  burst: number;
}

export interface ScheduledSegment {
  id: string;
  start: number;
  finish: number;
}

export interface RoundRobinResult {
  /** 执行时间段序列（甘特图段）。 */
  segments: ScheduledSegment[];
  /** 每个进程的统计。 */
  stats: Array<{
    id: string;
    arrival: number;
    burst: number;
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
export interface RoundRobinHooks {
  /** 从就绪队列头部取出某进程执行一个时间片。 */
  onDispatch?: (job: Job, quantum: number, readyQueue: Job[]) => void;
  /** 某进程开始/继续运行一段。 */
  onRun?: (job: Job, start: number, finish: number) => void;
  /** 某进程未完成，重新加入就绪队列尾部。 */
  onRequeue?: (job: Job, remaining: number) => void;
  /** 某进程执行完成。 */
  onComplete?: (job: Job, finish: number) => void;
}

export interface RoundRobinOptions {
  /** 时间片大小。 */
  quantum: number;
}

/**
 * 轮转调度（Round Robin）。
 *
 * 规则：
 *  - 维护一个 FIFO 就绪队列
 *  - 每次从队首取一个进程，运行 min(quantum, remaining) 时间
 *  - 运行期间到达的新进程加入队尾（在该进程之后）
 *  - 若运行后仍未完成，排到队尾；否则标记完成
 *  - 若就绪队列为空但仍有未完成进程，时间快进到下一个到达
 *
 * @param jobs 进程列表
 * @param options 选项（quantum 时间片）
 * @param hooks 可选事件钩子
 * @returns 调度结果
 */
export function roundRobin(
  jobs: readonly Job[],
  options: RoundRobinOptions,
  hooks: RoundRobinHooks = {},
): RoundRobinResult {
  const { quantum } = options;
  const n = jobs.length;

  if (n === 0) {
    return { segments: [], stats: [], avgWaiting: 0, avgTurnaround: 0 };
  }

  // 剩余时间
  const remaining = new Map<string, number>();
  const jobMap = new Map<string, Job>();
  for (const j of jobs) {
    remaining.set(j.id, j.burst);
    jobMap.set(j.id, j);
  }

  // 按到达时间排序的副本，用于按序加入就绪队列
  const arrivalOrder = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let arrivalIdx = 0;

  const readyQueue: Job[] = [];
  let now = 0;
  const segments: ScheduledSegment[] = [];
  const finishTime = new Map<string, number>();
  const done = new Set<string>();

  // 把到 now 时刻为止新到达的进程加入就绪队列
  const admit = (t: number): void => {
    while (arrivalIdx < arrivalOrder.length && arrivalOrder[arrivalIdx]!.arrival <= t) {
      readyQueue.push(arrivalOrder[arrivalIdx]!);
      arrivalIdx++;
    }
  };

  admit(now);
  // 若初始无就绪，快进
  if (readyQueue.length === 0 && arrivalIdx < arrivalOrder.length) {
    now = arrivalOrder[arrivalIdx]!.arrival;
    admit(now);
  }

  while (done.size < n) {
    if (readyQueue.length === 0) {
      // 快进到下一个到达
      if (arrivalIdx >= arrivalOrder.length) break;
      now = arrivalOrder[arrivalIdx]!.arrival;
      admit(now);
      continue;
    }

    const job = readyQueue.shift()!;
    const remain = remaining.get(job.id)!;
    const run = Math.min(quantum, remain);
    const start = Math.max(now, job.arrival);
    const finish = start + run;

    hooks.onDispatch?.(job, quantum, [...readyQueue]);
    hooks.onRun?.(job, start, finish);
    segments.push({ id: job.id, start, finish });

    // 运行期间到达的新进程先入队（在该进程之前，符合 RR 语义）
    now = finish;
    admit(now);

    const newRemain = remain - run;
    remaining.set(job.id, newRemain);

    if (newRemain === 0) {
      done.add(job.id);
      finishTime.set(job.id, finish);
      hooks.onComplete?.(job, finish);
    } else {
      // 重新加入队尾（注意：admit 已把 run 期间到达的进程加入，故本进程排在它们之后）
      readyQueue.push(job);
      hooks.onRequeue?.(job, newRemain);
    }
  }

  // 统计
  const stats = jobs.map((j) => {
    const finish = finishTime.get(j.id)!;
    const turnaround = finish - j.arrival;
    const waiting = turnaround - j.burst;
    return { id: j.id, arrival: j.arrival, burst: j.burst, finish, waiting, turnaround };
  });
  const avgWaiting = stats.reduce((s, x) => s + x.waiting, 0) / (n || 1);
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / (n || 1);

  return { segments, stats, avgWaiting, avgTurnaround };
}
