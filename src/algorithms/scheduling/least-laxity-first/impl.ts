// 最小松弛度优先（LLF）· 纯算法实现

export interface LlfTask {
  id: string;
  period: number;
  deadline: number; // 相对截止期 D
  execution: number; // C
}

export interface LlfSegment {
  id: string;
  start: number;
  finish: number;
}

export interface LlfResult {
  segments: LlfSegment[];
  simHorizon: number;
  feasible: boolean;
  deadlineMisses: number;
}

/** 事件钩子。 */
export interface LlfHooks {
  /** 每个时间步，给出当前各任务 laxity 快照（id -> laxity）与被选中的任务。 */
  onStep?: (
    time: number,
    laxities: Array<{ id: string; laxity: number }>,
    picked: string | null,
  ) => void;
  onJobComplete?: (taskId: string, time: number) => void;
  onDeadlineMiss?: (taskId: string, time: number) => void;
}

/**
 * 最小松弛度优先仿真。
 *
 * @param tasks 任务集
 * @param simHorizon 仿真时长（默认按周期估算）
 * @param hooks 可选事件钩子
 */
export function leastLaxityFirst(
  tasks: readonly LlfTask[],
  simHorizon: number = 0,
  hooks: LlfHooks = {},
): LlfResult {
  if (tasks.length === 0) return { segments: [], simHorizon: 0, feasible: true, deadlineMisses: 0 };

  const horizon =
    simHorizon > 0
      ? simHorizon
      : Math.max(20, [...tasks].reduce((m, t) => Math.max(m, t.period), 0) * 2);

  const nextRelease = new Map<string, number>();
  const remaining = new Map<string, number>();
  const absDeadline = new Map<string, number>();
  for (const t of tasks) {
    nextRelease.set(t.id, 0);
    remaining.set(t.id, 0);
    absDeadline.set(t.id, Infinity);
  }

  const segments: LlfSegment[] = [];
  let deadlineMisses = 0;

  for (let time = 0; time < horizon; time++) {
    // 释放
    for (const t of tasks) {
      if (time === nextRelease.get(t.id)) {
        remaining.set(t.id, t.execution);
        absDeadline.set(t.id, time + t.deadline);
        nextRelease.set(t.id, time + t.period);
      }
    }
    // 截止期检查
    for (const t of tasks) {
      if ((remaining.get(t.id) ?? 0) > 0 && time >= (absDeadline.get(t.id) ?? Infinity)) {
        deadlineMisses++;
        hooks.onDeadlineMiss?.(t.id, time);
        remaining.set(t.id, 0);
        absDeadline.set(t.id, Infinity);
      }
    }
    // 计算 laxity
    const laxities: Array<{ id: string; laxity: number }> = [];
    let pickId: string | null = null;
    let minLax = Infinity;
    for (const t of tasks) {
      const rem = remaining.get(t.id) ?? 0;
      if (rem > 0) {
        const lax = (absDeadline.get(t.id) ?? Infinity) - time - rem;
        laxities.push({ id: t.id, laxity: lax });
        if (lax < minLax) {
          minLax = lax;
          pickId = t.id;
        }
      }
    }
    hooks.onStep?.(time, laxities, pickId);
    if (pickId === null) continue;

    remaining.set(pickId, (remaining.get(pickId) ?? 0) - 1);
    const last = segments[segments.length - 1];
    if (last && last.id === pickId && last.finish === time) {
      last.finish = time + 1;
    } else {
      segments.push({ id: pickId, start: time, finish: time + 1 });
    }
    if ((remaining.get(pickId) ?? 0) === 0) {
      hooks.onJobComplete?.(pickId, time + 1);
      absDeadline.set(pickId, Infinity);
    }
  }

  return {
    segments,
    simHorizon: horizon,
    feasible: deadlineMisses === 0,
    deadlineMisses,
  };
}
