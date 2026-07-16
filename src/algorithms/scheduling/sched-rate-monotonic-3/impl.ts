// Rate Monotonic v3 · 纯算法实现
// 速率单调调度：周期越短优先级越高。在 horizon 内模拟时间推进。

export interface RmsTask {
  pid: string;
  period: number;
  execution: number;
}

export interface RmsHooks {
  onRelease?: (pid: string, job: number, time: number) => void;
}

export function rmsSchedule(
  tasks: RmsTask[],
  horizon: number,
  hooks?: RmsHooks,
): {
  allDeadlinesMet: boolean;
  jobsCompleted: number;
  jobsMissed: number;
  timeline: Array<{ pid: string; start: number; end: number }>;
} {
  const sorted = [...tasks].sort((a, b) => a.period - b.period);
  let jobsCompleted = 0;
  let jobsMissed = 0;
  let allDeadlinesMet = true;
  const timeline: Array<{ pid: string; start: number; end: number }> = [];

  const jobExecLeft = new Map<string, number>();
  for (const t of sorted) {
    jobExecLeft.set(t.pid, t.execution);
    hooks?.onRelease?.(t.pid, 0, 0);
  }

  for (let time = 0; time < horizon; time++) {
    for (const t of sorted) {
      if (time > 0 && time % t.period === 0) {
        if ((jobExecLeft.get(t.pid) ?? 0) > 0) {
          allDeadlinesMet = false;
          jobsMissed++;
        }
        jobExecLeft.set(t.pid, t.execution);
        hooks?.onRelease?.(t.pid, time / t.period, time);
      }
    }

    let run: RmsTask | null = null;
    for (const t of sorted) {
      if ((jobExecLeft.get(t.pid) ?? 0) > 0) {
        run = t;
        break;
      }
    }

    if (run) {
      jobExecLeft.set(run.pid, (jobExecLeft.get(run.pid) ?? 0) - 1);
      if ((jobExecLeft.get(run.pid) ?? 0) <= 0) jobsCompleted++;
    }
  }

  for (const t of sorted) {
    if ((jobExecLeft.get(t.pid) ?? 0) > 0) {
      allDeadlinesMet = false;
      jobsMissed++;
    }
  }

  for (const t of sorted) {
    timeline.push({ pid: t.pid, start: 0, end: t.execution });
  }

  return { allDeadlinesMet, jobsCompleted, jobsMissed, timeline };
}
