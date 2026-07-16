// 作业调度 · 实现
export interface Job {
  id: string;
  profit: number;
  deadline: number;
}
export interface JobHooks {
  onSchedule?: (job: Job, slot: number) => void;
  onSkip?: (job: Job) => void;
  onConclude?: (totalProfit: number, slots: Array<Job | null>) => void;
}
export interface JobResult {
  totalProfit: number;
  slots: Array<Job | null>;
}
export function greedyJob3(jobs: ReadonlyArray<Job>, hooks: JobHooks = {}): JobResult {
  const maxDl = jobs.reduce((m, j) => Math.max(m, j.deadline), 0);
  const slots: Array<Job | null> = new Array(maxDl).fill(null);
  const order = [...jobs].sort((a, b) => b.profit - a.profit);
  let totalProfit = 0;
  for (const j of order) {
    let placed = -1;
    for (let s = Math.min(j.deadline, maxDl) - 1; s >= 0; s--) {
      if (slots[s] === null) {
        placed = s;
        break;
      }
    }
    if (placed >= 0) {
      slots[placed] = j;
      totalProfit += j.profit;
      hooks.onSchedule?.(j, placed);
    } else hooks.onSkip?.(j);
  }
  hooks.onConclude?.(totalProfit, slots);
  return { totalProfit, slots };
}
