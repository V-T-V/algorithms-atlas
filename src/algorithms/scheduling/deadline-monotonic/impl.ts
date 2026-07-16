// 截止单调调度（DM）· 纯算法实现
// 静态优先级：相对截止期 D 越短优先级越高（1=最高）。

export interface DmTask {
  id: string;
  /** 周期 T（首个作业在 t=0 释放，之后每 T 释放）。 */
  period: number;
  /** 相对截止期 D（从释放算起，D ≤ T 通常）。 */
  deadline: number;
  /** 每周期执行时间 C。 */
  execution: number;
}

export interface DmTaskAnalysis extends DmTask {
  /** 静态优先级（1=最高，按 D 升序）。 */
  priority: number;
}

export interface DmSegment {
  id: string;
  start: number;
  finish: number;
}

export interface DmResult {
  tasks: DmTaskAnalysis[];
  segments: DmSegment[];
  simHorizon: number;
  /** 仿真期间是否有作业错过截止期。 */
  feasible: boolean;
  /** 错过截止期的次数。 */
  deadlineMisses: number;
}

/** 事件钩子。 */
export interface DmHooks {
  /** 每个时间步调度某任务（null=空闲）。 */
  onStep?: (time: number, taskId: string | null) => void;
  /** 某作业完成。 */
  onJobComplete?: (taskId: string, time: number) => void;
  /** 检测到错过截止期。 */
  onDeadlineMiss?: (taskId: string, time: number) => void;
}

/**
 * 截止单调调度仿真。
 *
 * @param tasks 任务集
 * @param simHorizon 仿真时长（默认取所有任务周期的最小公倍数附近，或 20）
 * @param hooks 可选事件钩子
 */
export function deadlineMonotonic(
  tasks: readonly DmTask[],
  simHorizon: number = 0,
  hooks: DmHooks = {},
): DmResult {
  if (tasks.length === 0)
    return { tasks: [], segments: [], simHorizon: 0, feasible: true, deadlineMisses: 0 };

  // 按 D 升序编号优先级
  const sorted = [...tasks].sort((a, b) => a.deadline - b.deadline || a.id.localeCompare(b.id));
  const analysis: DmTaskAnalysis[] = sorted.map((t, i) => ({ ...t, priority: i + 1 }));

  const horizon =
    simHorizon > 0
      ? simHorizon
      : Math.max(20, [...tasks].reduce((m, t) => Math.max(m, t.period), 0) * 2);

  // 每任务：下次释放、剩余执行（当前作业）、绝对截止期
  const nextRelease = new Map<string, number>();
  const remaining = new Map<string, number>();
  const absDeadline = new Map<string, number>();
  const releaseCount = new Map<string, number>();
  for (const t of tasks) {
    nextRelease.set(t.id, 0);
    remaining.set(t.id, 0);
    absDeadline.set(t.id, Infinity);
    releaseCount.set(t.id, 0);
  }

  const segments: DmSegment[] = [];
  let deadlineMisses = 0;

  for (let time = 0; time < horizon; time++) {
    // 检查释放
    for (const t of tasks) {
      if (time === nextRelease.get(t.id)) {
        // 释放新作业
        remaining.set(t.id, t.execution);
        absDeadline.set(t.id, time + t.deadline);
        releaseCount.set(t.id, (releaseCount.get(t.id) ?? 0) + 1);
        nextRelease.set(t.id, time + t.period);
      }
    }
    // 检查截止期错过（有剩余但到截止期）
    for (const t of tasks) {
      if ((remaining.get(t.id) ?? 0) > 0 && time >= (absDeadline.get(t.id) ?? Infinity)) {
        deadlineMisses++;
        hooks.onDeadlineMiss?.(t.id, time);
        // 标记该作业失败，丢弃剩余（避免无限累积）
        remaining.set(t.id, 0);
        absDeadline.set(t.id, Infinity);
      }
    }
    // 选优先级最高（priority 最小）的有剩余任务
    const ready = analysis.filter((t) => (remaining.get(t.id) ?? 0) > 0);
    if (ready.length === 0) {
      hooks.onStep?.(time, null);
      continue;
    }
    const pick = ready.reduce((a, b) => (a.priority < b.priority ? a : b));
    hooks.onStep?.(time, pick.id);
    remaining.set(pick.id, (remaining.get(pick.id) ?? 0) - 1);
    // 记段
    const last = segments[segments.length - 1];
    if (last && last.id === pick.id && last.finish === time) {
      last.finish = time + 1;
    } else {
      segments.push({ id: pick.id, start: time, finish: time + 1 });
    }
    if ((remaining.get(pick.id) ?? 0) === 0) {
      hooks.onJobComplete?.(pick.id, time + 1);
      absDeadline.set(pick.id, Infinity);
    }
  }

  return {
    tasks: analysis,
    segments,
    simHorizon: horizon,
    feasible: deadlineMisses === 0,
    deadlineMisses,
  };
}
