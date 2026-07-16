// CFS VRuntime Scheduling v2 · 纯算法实现
export interface CfsTask {
  pid: string;
  arrival: number;
  burst: number;
  weight: number;
}
export interface CfsHooks {
  onPick?: (pid: string, vruntime: number) => void;
}

export function cfsSchedule(
  tasks: CfsTask[],
  quantum: number,
  weightBase: number = 1024,
  hooks: CfsHooks = {},
): {
  completion: Record<string, number>;
  timeline: Array<{ pid: string; start: number; end: number }>;
} {
  const remaining = new Map<string, number>();
  const vruntime = new Map<string, number>();
  const completion: Record<string, number> = {};
  const timeline: Array<{ pid: string; start: number; end: number }> = [];
  for (const t of tasks) {
    remaining.set(t.pid, t.burst);
    vruntime.set(t.pid, 0);
  }
  let time = 0;
  while ([...remaining.values()].some((r) => r > 0)) {
    let best: string | null = null;
    let bestVr = Infinity;
    for (const t of tasks) {
      if ((remaining.get(t.pid) ?? 0) <= 0) continue;
      const vr = vruntime.get(t.pid) ?? 0;
      if (vr < bestVr) {
        bestVr = vr;
        best = t.pid;
      }
    }
    if (!best) break;
    const task = tasks.find((t) => t.pid === best)!;
    const run = Math.min(quantum, remaining.get(best) ?? 0);
    hooks.onPick?.(best, bestVr);
    timeline.push({ pid: best, start: time, end: time + run });
    time += run;
    remaining.set(best, (remaining.get(best) ?? 0) - run);
    vruntime.set(best, (vruntime.get(best) ?? 0) + (run * weightBase) / task.weight);
    if ((remaining.get(best) ?? 0) <= 0) completion[best] = time;
  }
  return { completion, timeline };
}
