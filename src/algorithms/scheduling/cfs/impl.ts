// =============================================================================
// 完全公平调度器（CFS）· 纯算法实现
// 按 vruntime 最小者调度；用排序数组模拟红黑树最左查询。零 DOM 依赖，可独立单测。
// =============================================================================

export interface CfsTask {
  id: string;
  arrival: number;
  burst: number;
  /** nice 值（-20..19，默认 0）。越低权重越大，分到更多 CPU。 */
  nice?: number;
}

export interface CfsSegment {
  id: string;
  start: number;
  finish: number;
  /** 该段运行后进程的 vruntime。 */
  vruntime: number;
}

export interface CfsTaskStat {
  id: string;
  arrival: number;
  burst: number;
  nice: number;
  /** 实际分到的 CPU 时间。 */
  runtime: number;
  finish: number;
  waiting: number;
  turnaround: number;
  finalVruntime: number;
}

export interface CfsResult {
  segments: CfsSegment[];
  stats: CfsTaskStat[];
  avgWaiting: number;
  avgTurnaround: number;
}

export interface CfsHooks {
  /** 选出 vruntime 最小的进程运行一个 min_granularity 片段。 */
  onPick?: (task: CfsTask, vruntime: number) => void;
  /** 进程运行一段（更新后的 vruntime）。 */
  onRun?: (task: CfsTask, start: number, finish: number, vruntime: number) => void;
  /** 进程完成。 */
  onComplete?: (task: CfsTask, finish: number) => void;
}

export interface CfsOptions {
  /** 目标调度周期（所有就绪进程跑一轮的目标总时长）。 */
  targetLatency?: number;
  /** 最小粒度（单次运行的最短时间）。 */
  minGranularity?: number;
}

/** nice → 权重映射（简化版：weight = 1024 / 1.25^nice，nice=0 时为 1024）。 */
export function niceToWeight(nice: number): number {
  return 1024 / Math.pow(1.25, nice);
}

interface TaskState {
  task: CfsTask;
  remaining: number;
  vruntime: number;
  weight: number;
  runtime: number;
  /** 是否已在就绪队列中。 */
  inReady: boolean;
  finish: number;
}

/**
 * 完全公平调度器（CFS）。
 *
 * @param tasks 任务列表
 * @param options 选项
 * @param hooks 可选钩子
 */
export function cfs(
  tasks: readonly CfsTask[],
  options: CfsOptions = {},
  hooks: CfsHooks = {},
): CfsResult {
  const n = tasks.length;
  if (n === 0) return { segments: [], stats: [], avgWaiting: 0, avgTurnaround: 0 };

  const targetLatency = options.targetLatency ?? 6;
  const minGranularity = options.minGranularity ?? 1;

  const states: TaskState[] = tasks.map((t) => ({
    task: t,
    remaining: t.burst,
    vruntime: 0,
    weight: niceToWeight(t.nice ?? 0),
    runtime: 0,
    inReady: false,
    finish: -1,
  }));
  const nice0Weight = niceToWeight(0);

  const arrivalOrder = [...states].sort((a, b) => a.task.arrival - b.task.arrival);
  let arrivalIdx = 0;
  const ready: TaskState[] = [];
  const segments: CfsSegment[] = [];
  let now = 0;

  const admit = (t: number): void => {
    while (arrivalIdx < arrivalOrder.length && arrivalOrder[arrivalIdx]!.task.arrival <= t) {
      const st = arrivalOrder[arrivalIdx]!;
      st.inReady = true;
      ready.push(st);
      arrivalIdx++;
    }
  };

  admit(now);
  if (ready.length === 0 && arrivalIdx < arrivalOrder.length) {
    now = arrivalOrder[arrivalIdx]!.task.arrival;
    admit(now);
  }

  const done = new Set<string>();
  while (done.size < n) {
    admit(now);
    if (ready.length === 0) {
      if (arrivalIdx >= arrivalOrder.length) break;
      now = arrivalOrder[arrivalIdx]!.task.arrival;
      admit(now);
      continue;
    }
    // 选 vruntime 最小者（平局取先到/索引小）
    let pickIdx = 0;
    for (let i = 1; i < ready.length; i++) {
      if (ready[i]!.vruntime < ready[pickIdx]!.vruntime) pickIdx = i;
    }
    const st = ready[pickIdx]!;
    ready.splice(pickIdx, 1);

    // 计算时间片：target_latency / ready.size，但至少 min_granularity，不超过 remaining
    const slice = Math.min(
      st.remaining,
      Math.max(minGranularity, Math.floor(targetLatency / Math.max(1, ready.length + 1))),
    );
    const start = Math.max(now, st.task.arrival);
    const finish = start + slice;
    hooks.onPick?.(st.task, st.vruntime);

    // vruntime 增量 = 实际运行时间 × (NICE_0_LOAD / weight)
    const dv = slice * (nice0Weight / st.weight);
    st.vruntime += dv;
    st.remaining -= slice;
    st.runtime += slice;
    now = finish;
    admit(now);

    segments.push({ id: st.task.id, start, finish, vruntime: st.vruntime });
    hooks.onRun?.(st.task, start, finish, st.vruntime);

    if (st.remaining === 0) {
      st.finish = finish;
      st.inReady = false;
      done.add(st.task.id);
      hooks.onComplete?.(st.task, finish);
    } else {
      // 重新插入就绪队列
      ready.push(st);
    }
  }

  const stats: CfsTaskStat[] = states.map((st) => ({
    id: st.task.id,
    arrival: st.task.arrival,
    burst: st.task.burst,
    nice: st.task.nice ?? 0,
    runtime: st.runtime,
    finish: st.finish,
    waiting: st.finish - st.task.arrival - st.task.burst,
    turnaround: st.finish - st.task.arrival,
    finalVruntime: st.vruntime,
  }));
  const avgWaiting = stats.reduce((s, x) => s + x.waiting, 0) / (n || 1);
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / (n || 1);

  return { segments, stats, avgWaiting, avgTurnaround };
}
