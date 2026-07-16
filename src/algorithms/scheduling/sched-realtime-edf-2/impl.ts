// 周期任务 EDF · 实现

export interface EdfTask {
  id: string;
  period: number;
  execution: number;
  deadline: number; // 相对截止期 D
}

export interface EdfSegment {
  id: string;
  jobNo: number;
  start: number;
  finish: number;
}

export interface EdfResult {
  segments: EdfSegment[];
  utilization: number;
  simHorizon: number;
  deadlineMisses: number;
  feasible: boolean;
}

export interface EdfHooks {
  onStep?: (time: number, taskId: string | null) => void;
  onDeadlineMiss?: (taskId: string, jobNo: number, deadline: number) => void;
  onComplete?: (taskId: string, jobNo: number, finish: number) => void;
}

/** 周期 EDF 仿真：逐时间单位选最近绝对截止期的就绪作业。 */
export function periodicEdf(tasks: EdfTask[], simHorizon = 0, hooks: EdfHooks = {}): EdfResult {
  if (tasks.length === 0)
    return { segments: [], utilization: 0, simHorizon: 0, deadlineMisses: 0, feasible: true };
  const utilization = tasks.reduce((s, t) => s + t.execution / t.period, 0);
  const horizon = simHorizon > 0 ? simHorizon : lcm(tasks.map((t) => t.period));
  // 每任务：下次释放、当前作业剩余、当前作业绝对截止期、当前作业编号
  const nextRelease = new Map<string, number>();
  const remaining = new Map<string, number>();
  const absDl = new Map<string, number>();
  const jobNo = new Map<string, number>();
  const completedThisJob = new Map<string, boolean>();
  for (const t of tasks) {
    nextRelease.set(t.id, 0);
    remaining.set(t.id, 0);
    absDl.set(t.id, Infinity);
    jobNo.set(t.id, 0);
    completedThisJob.set(t.id, true);
  }
  const segments: EdfSegment[] = [];
  let deadlineMisses = 0;
  let curSeg: EdfSegment | null = null;

  for (let time = 0; time < horizon; time++) {
    // 释放新作业
    for (const t of tasks) {
      if (time === nextRelease.get(t.id)!) {
        // 若上一作业未完成 -> 错过
        if (!completedThisJob.get(t.id)!) {
          deadlineMisses++;
          hooks.onDeadlineMiss?.(t.id, jobNo.get(t.id)!, absDl.get(t.id)!);
        }
        const jn = jobNo.get(t.id)! + 1;
        jobNo.set(t.id, jn);
        remaining.set(t.id, t.execution);
        absDl.set(t.id, time + t.deadline);
        completedThisJob.set(t.id, false);
        nextRelease.set(t.id, time + t.period);
      }
    }
    // 检查在 t 时刻已超截止期且未完成的作业（截止期 < t+1 视为错过）
    for (const t of tasks) {
      if (!completedThisJob.get(t.id)! && remaining.get(t.id)! > 0 && absDl.get(t.id)! <= time) {
        deadlineMisses++;
        hooks.onDeadlineMiss?.(t.id, jobNo.get(t.id)!, absDl.get(t.id)!);
        completedThisJob.set(t.id, true); // 标记已统计
        remaining.set(t.id, 0);
      }
    }
    // 选最近截止期就绪作业
    let best: EdfTask | null = null;
    for (const t of tasks) {
      if (remaining.get(t.id)! > 0) {
        if (best === null || absDl.get(t.id)! < absDl.get(best.id)!) best = t;
      }
    }
    const runningId = best?.id ?? null;
    hooks.onStep?.(time, runningId);
    if (best !== null) {
      remaining.set(best.id, remaining.get(best.id)! - 1);
      if (curSeg === null || curSeg.id !== best.id || curSeg.jobNo !== jobNo.get(best.id)!) {
        if (curSeg !== null) segments.push(curSeg);
        curSeg = { id: best.id, jobNo: jobNo.get(best.id)!, start: time, finish: time + 1 };
      } else {
        curSeg.finish = time + 1;
      }
      if (remaining.get(best.id)! === 0) {
        completedThisJob.set(best.id, true);
        hooks.onComplete?.(best.id, jobNo.get(best.id)!, time + 1);
      }
    } else {
      if (curSeg !== null) {
        segments.push(curSeg);
        curSeg = null;
      }
    }
  }
  if (curSeg !== null) segments.push(curSeg);
  return {
    segments,
    utilization,
    simHorizon: horizon,
    deadlineMisses,
    feasible: deadlineMisses === 0,
  };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
function lcm(nums: number[]): number {
  return nums.reduce((acc, n) => (acc * n) / gcd(acc, n), 1);
}
