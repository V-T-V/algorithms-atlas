// 速率单调响应时间分析 · 实现

export interface RtaTask {
  id: string;
  period: number; // T
  execution: number; // C
  deadline: number; // D（RMS 中通常 D = T）
}

export interface RtaResult {
  /** 按优先级（周期升序）排列的任务及分析结果。 */
  tasks: Array<
    RtaTask & { priority: number; responseTime: number; schedulable: boolean; iterations: number }
  >;
  /** 总利用率。 */
  utilization: number;
  /** Liu-Layland 上界。 */
  liuLaylandBound: number;
  /** 是否全部可调度（RTA 精确判定）。 */
  allSchedulable: boolean;
}

export interface RtaHooks {
  onIterate?: (taskId: string, iteration: number, responseTime: number) => void;
  onTaskDone?: (taskId: string, responseTime: number, schedulable: boolean) => void;
}

/**
 * 响应时间分析。优先级 = 周期升序（速率单调）。
 */
export function responseTimeAnalysis(tasks: RtaTask[], hooks: RtaHooks = {}): RtaResult {
  const sorted = [...tasks].sort((a, b) => a.period - b.period || a.id.localeCompare(b.id));
  const n = sorted.length;
  const utilization = sorted.reduce((s, t) => s + t.execution / t.period, 0);
  const liuLaylandBound = n * (Math.pow(2, 1 / n) - 1);
  const results: RtaResult['tasks'] = [];
  let allSchedulable = true;

  for (let i = 0; i < n; i++) {
    const ti = sorted[i]!;
    let r = ti.execution; // R_0 = C_i（初始下界）
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
        // 超过截止期，不可调度
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
        // 收敛
        results.push({
          ...ti,
          priority: i + 1,
          responseTime: next,
          schedulable: next <= ti.deadline,
          iterations: iter,
        });
        if (!results[results.length - 1]!.schedulable) allSchedulable = false;
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
  return { tasks: results, utilization, liuLaylandBound, allSchedulable };
}
