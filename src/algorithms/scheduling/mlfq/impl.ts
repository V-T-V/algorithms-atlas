// =============================================================================
// 多级反馈队列（MLFQ）· 纯算法实现
// 进程用完时间片降级；周期性提升所有进程。零 DOM 依赖，可独立单测。
// =============================================================================

export interface MlfqJob {
  id: string;
  arrival: number;
  burst: number;
}

export interface MlfqLevelConfig {
  /** 该层时间片。 */
  quantum: number;
}

export interface MlfqSegment {
  id: string;
  start: number;
  finish: number;
  /** 运行该段时的层级。 */
  level: number;
}

export interface MlfqJobStat {
  id: string;
  arrival: number;
  burst: number;
  finish: number;
  waiting: number;
  turnaround: number;
  /** 最终所在层级。 */
  finalLevel: number;
}

export interface MlfqResult {
  segments: MlfqSegment[];
  stats: MlfqJobStat[];
  avgWaiting: number;
  avgTurnaround: number;
}

export interface MlfqHooks {
  /** 进程在某层被派发运行一个时间片。 */
  onDispatch?: (job: MlfqJob, level: number, quantum: number) => void;
  /** 进程运行一段。 */
  onRun?: (job: MlfqJob, level: number, start: number, finish: number) => void;
  /** 进程因用完时间片从 level 降到 level+1。 */
  onDemote?: (job: MlfqJob, fromLevel: number, toLevel: number) => void;
  /** 周期性提升：所有进程回到第 0 层。 */
  onBoost?: (time: number) => void;
  /** 进程完成。 */
  onComplete?: (job: MlfqJob, finish: number) => void;
}

export interface MlfqOptions {
  /** 各层配置（按 level 升序，level 0 最高优先级）。 */
  levels: MlfqLevelConfig[];
  /** 提升周期（每隔 boostInterval 时间提升一次；0 表示不提升）。 */
  boostInterval?: number;
}

interface JobState {
  job: MlfqJob;
  remaining: number;
  level: number;
  /** 本时间片内已用（用于判断是否用完）。 */
  usedThisQuantum: number;
}

/**
 * 多级反馈队列调度。
 *
 * @param jobs 进程列表
 * @param options 配置（levels 各层时间片；boostInterval 周期提升）
 * @param hooks 可选钩子
 */
export function mlfq(
  jobs: readonly MlfqJob[],
  options: MlfqOptions,
  hooks: MlfqHooks = {},
): MlfqResult {
  const n = jobs.length;
  const { levels, boostInterval = 0 } = options;
  if (n === 0 || levels.length === 0) {
    return { segments: [], stats: [], avgWaiting: 0, avgTurnaround: 0 };
  }
  const maxLevel = levels.length - 1;

  // 每层的就绪队列
  const readyQueues: JobState[][] = levels.map(() => []);
  const stateMap = new Map<string, JobState>();
  for (const j of jobs) {
    const st: JobState = { job: j, remaining: j.burst, level: 0, usedThisQuantum: 0 };
    stateMap.set(j.id, st);
  }

  const arrivalOrder = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let arrivalIdx = 0;
  const segments: MlfqSegment[] = [];
  const finishTime = new Map<string, number>();
  const done = new Set<string>();
  let now = 0;
  let lastBoost = 0;

  const admit = (t: number): void => {
    while (arrivalIdx < arrivalOrder.length && arrivalOrder[arrivalIdx]!.arrival <= t) {
      const st = stateMap.get(arrivalOrder[arrivalIdx]!.id)!;
      readyQueues[st.level]!.push(st);
      arrivalIdx++;
    }
  };

  const pickTop = (): JobState | null => {
    for (let lv = 0; lv <= maxLevel; lv++) {
      if (readyQueues[lv]!.length > 0) return readyQueues[lv]!.shift() ?? null;
    }
    return null;
  };

  admit(now);

  while (done.size < n) {
    // 周期提升
    if (boostInterval > 0 && now - lastBoost >= boostInterval) {
      // 把所有就绪队列里的进程合并回 level 0
      const all: JobState[] = [];
      for (let lv = 0; lv <= maxLevel; lv++) {
        all.push(...readyQueues[lv]!);
        readyQueues[lv]!.length = 0;
      }
      for (const st of all) {
        st.level = 0;
        st.usedThisQuantum = 0;
        readyQueues[0]!.push(st);
      }
      lastBoost = now;
      hooks.onBoost?.(now);
    }

    const st = pickTop();
    if (!st) {
      if (arrivalIdx >= arrivalOrder.length) break;
      now = arrivalOrder[arrivalIdx]!.arrival;
      admit(now);
      continue;
    }

    const lv = st.level;
    const q = levels[lv]!.quantum;
    // 若本段时间片会跨越下一个提升点，则在提升点处截断，
    // 以保证周期提升按真实时间触发（而非被长量子片跳过）。
    let run = Math.min(q, st.remaining);
    if (boostInterval > 0) {
      const nextBoost = lastBoost + boostInterval;
      if (nextBoost > now && now + run > nextBoost) {
        run = nextBoost - now;
      }
    }
    const start = Math.max(now, st.job.arrival);
    const finish = start + run;

    hooks.onDispatch?.(st.job, lv, q);
    hooks.onRun?.(st.job, lv, start, finish);
    segments.push({ id: st.job.id, start, finish, level: lv });

    now = finish;
    admit(now);
    st.remaining -= run;
    st.usedThisQuantum += run;

    if (st.remaining === 0) {
      done.add(st.job.id);
      finishTime.set(st.job.id, finish);
      hooks.onComplete?.(st.job, finish);
    } else if (st.usedThisQuantum >= q) {
      // 用完时间片 → 降级
      const nextLevel = Math.min(maxLevel, lv + 1);
      if (nextLevel !== lv) hooks.onDemote?.(st.job, lv, nextLevel);
      st.level = nextLevel;
      st.usedThisQuantum = 0;
      readyQueues[nextLevel]!.push(st);
    } else {
      // 未用完时间片（被提升点截断或主动让出）→ 留在当前层队尾
      readyQueues[lv]!.push(st);
    }
  }

  const stats: MlfqJobStat[] = jobs.map((j) => {
    const finish = finishTime.get(j.id)!;
    const turnaround = finish - j.arrival;
    const waiting = turnaround - j.burst;
    const st = stateMap.get(j.id)!;
    return {
      id: j.id,
      arrival: j.arrival,
      burst: j.burst,
      finish,
      waiting,
      turnaround,
      finalLevel: st.level,
    };
  });
  const avgWaiting = stats.reduce((s, x) => s + x.waiting, 0) / (n || 1);
  const avgTurnaround = stats.reduce((s, x) => s + x.turnaround, 0) / (n || 1);

  return { segments, stats, avgWaiting, avgTurnaround };
}
