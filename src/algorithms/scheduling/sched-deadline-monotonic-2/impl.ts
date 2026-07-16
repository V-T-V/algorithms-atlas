// 截止单调响应时间分析 · 实现

export interface DmRtaTask {
  id: string;
  period: number;
  execution: number;
  deadline: number; // 相对截止期 D（≤ T 通常）
}

export interface DmRtaResult {
  tasks: Array<
    DmRtaTask & { priority: number; responseTime: number; schedulable: boolean; iterations: number }
  >;
  utilization: number;
  density: number;
  allSchedulable: boolean;
}

export interface DmRtaHooks {
  onIterate?: (taskId: string, iteration: number, responseTime: number) => void;
  onTaskDone?: (taskId: string, responseTime: number, schedulable: boolean) => void;
}

/**
 * 截止单调 RTA：优先级按 D 升序。
 */
export function deadlineMonotonicRta(tasks: DmRtaTask[], hooks: DmRtaHooks = {}): DmRtaResult {
  const sorted = [...tasks].sort((a, b) => a.deadline - b.deadline || a.id.localeCompare(b.id));
  const n = sorted.length;
  const utilization = sorted.reduce((s, t) => s + t.execution / t.period, 0);
  const density = sorted.reduce((s, t) => s + t.execution / Math.min(t.deadline, t.period), 0);
  const results: DmRtaResult['tasks'] = [];
  let allSchedulable = true;

  for (let i = 0; i < n; i++) {
    const ti = sorted[i]!;
    let r = ti.execution;
    let iter = 0;
    const MAX_ITER = 10000;
    while (iter < MAX_ITER) {
      iter++;
      let interference = 0;
      for (let j = 0; j < i; j++) {
        const tj = sorted[j]!;
        interference += Math.ceil(r / tj.period) * tj.execution;
      }
      const next = ti.execution + interference;
      hooks.onIterate?.(ti.id, iter, next);
      if (next > ti.deadline) {
        results.push({
          ...ti,
          priority: i + 1,
          responseTime: next,
          schedulable: false,
          iterations: iter,
        });
        allSchedulable = false;
        break;
      }
      if (next === r) {
        const ok = next <= ti.deadline;
        results.push({
          ...ti,
          priority: i + 1,
          responseTime: next,
          schedulable: ok,
          iterations: iter,
        });
        if (!ok) allSchedulable = false;
        break;
      }
      r = next;
    }
    if (iter >= MAX_ITER) {
      results.push({
        ...ti,
        priority: i + 1,
        responseTime: Infinity,
        schedulable: false,
        iterations: iter,
      });
      allSchedulable = false;
    }
    const last = results[results.length - 1]!;
    hooks.onTaskDone?.(ti.id, last.responseTime, last.schedulable);
  }
  return { tasks: results, utilization, density, allSchedulable };
}
