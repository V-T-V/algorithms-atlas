// =============================================================================
// 多级队列调度（Multilevel Queue）· 纯算法实现
// 进程分入固定优先级队列，队列间固定优先级抢占。零 DOM 依赖，可独立单测。
// =============================================================================

export interface MqJob {
  id: string;
  arrival: number;
  burst: number;
  /** 所属队列下标（0..queues.length-1）。 */
  queue: number;
}

export interface MqQueueConfig {
  /** 优先级（数值越小越高）。 */
  priority: number;
  /** 队内算法：'rr' 轮转 / 'fcfs' 先来先服务。 */
  algorithm: 'rr' | 'fcfs';
  /** 时间片（仅 rr 用）。 */
  quantum: number;
}

export interface MqSegment {
  id: string;
  start: number;
  finish: number;
  /** 运行该段的队列下标。 */
  queue: number;
}

export interface MqJobStat {
  id: string;
  arrival: number;
  burst: number;
  queue: number;
  finish: number;
  waiting: number;
  turnaround: number;
}

export interface MultilevelQueueResult {
  segments: MqSegment[];
  stats: MqJobStat[];
  avgWaiting: number;
  avgTurnaround: number;
}

export interface MqHooks {
  /** 从某队列派发一个进程运行一个时间片。 */
  onDispatch?: (job: MqJob, queueIdx: number, queueName: string) => void;
  /** 某进程运行一段。 */
  onRun?: (job: MqJob, start: number, finish: number) => void;
  /** 某进程完成。 */
  onComplete?: (job: MqJob, finish: number) => void;
}

/**
 * 多级队列调度（固定优先级队列间调度）。
 *
 * @param jobs 进程列表
 * @param queues 队列配置（按 priority 升序处理；priority 相同按下标）
 * @param hooks 可选钩子
 */
export function multilevelQueue(
  jobs: readonly MqJob[],
  queues: readonly MqQueueConfig[],
  hooks: MqHooks = {},
): MultilevelQueueResult {
  const n = jobs.length;
  if (n === 0 || queues.length === 0) {
    return { segments: [], stats: [], avgWaiting: 0, avgTurnaround: 0 };
  }

  const remaining = new Map<string, number>();
  const jobMap = new Map<string, MqJob>();
  for (const j of jobs) {
    remaining.set(j.id, j.burst);
    jobMap.set(j.id, j);
  }

  // 队列优先级顺序（priority 小的优先；平局按原下标）
  const order = queues
    .map((q, i) => ({ q, i }))
    .sort((a, b) => a.q.priority - b.q.priority || a.i - b.i)
    .map((e) => e.i);

  // 每个队列的就绪队列（FIFO）
  const readyQueues: MqJob[][] = queues.map(() => []);
  const arrivalOrder = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let arrivalIdx = 0;

  const segments: MqSegment[] = [];
  const finishTime = new Map<string, number>();
  const done = new Set<string>();
  const quantumUsed = new Map<string, number>(); // 每进程本轮已用（用于 rr）

  let now = 0;
  const admit = (t: number): void => {
    while (arrivalIdx < arrivalOrder.length && arrivalOrder[arrivalIdx]!.arrival <= t) {
      const j = arrivalOrder[arrivalIdx]!;
      readyQueues[j.queue]!.push(j);
      arrivalIdx++;
    }
  };

  admit(now);
  if (readyQueues.every((q) => q.length === 0) && arrivalIdx < arrivalOrder.length) {
    now = arrivalOrder[arrivalIdx]!.arrival;
    admit(now);
  }

  while (done.size < n) {
    admit(now);
    // 选最高优先级非空队列
    let chosenQueue = -1;
    for (const qi of order) {
      if (readyQueues[qi]!.length > 0) {
        chosenQueue = qi;
        break;
      }
    }
    if (chosenQueue === -1) {
      // 全空，快进
      if (arrivalIdx >= arrivalOrder.length) break;
      now = arrivalOrder[arrivalIdx]!.arrival;
      admit(now);
      continue;
    }

    const cfg = queues[chosenQueue]!;
    const rq = readyQueues[chosenQueue]!;
    const job = rq.shift()!;
    const remain = remaining.get(job.id)!;
    if (cfg.algorithm === 'rr') {
      const run = Math.min(cfg.quantum, remain);
      const start = Math.max(now, job.arrival);
      const finish = start + run;
      hooks.onDispatch?.(job, chosenQueue, `Q${chosenQueue}(RR,q=${cfg.quantum})`);
      hooks.onRun?.(job, start, finish);
      segments.push({ id: job.id, start, finish, queue: chosenQueue });
      now = finish;
      admit(now);
      const newRemain = remain - run;
      remaining.set(job.id, newRemain);
      quantumUsed.set(job.id, run);
      if (newRemain === 0) {
        done.add(job.id);
        finishTime.set(job.id, finish);
        hooks.onComplete?.(job, finish);
      } else {
        // 重新加入队尾（admit 已加入运行期间到达的同队列进程）
        rq.push(job);
      }
    } else {
      // fcfs：跑到完
      const run = remain;
      const start = Math.max(now, job.arrival);
      const finish = start + run;
      hooks.onDispatch?.(job, chosenQueue, `Q${chosenQueue}(FCFS)`);
      hooks.onRun?.(job, start, finish);
      segments.push({ id: job.id, start, finish, queue: chosenQueue });
      now = finish;
      admit(now);
      remaining.set(job.id, 0);
      quantumUsed.set(job.id, run);
      done.add(job.id);
      finishTime.set(job.id, finish);
      hooks.onComplete?.(job, finish);
    }
  }

  const stats: MqJobStat[] = jobs.map((j) => {
    const finish = finishTime.get(j.id)!;
    const turnaround = finish - j.arrival;
    const waiting = turnaround - j.burst;
    return {
      id: j.id,
      arrival: j.arrival,
      burst: j.burst,
      queue: j.queue,
      finish,
      waiting,
      turnaround,
    };
  });
  const avgWaiting = stats.reduce((s, x) => s + x.waiting, 0) / (n || 1);
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / (n || 1);
  void quantumUsed;

  return { segments, stats, avgWaiting, avgTurnaround };
}
